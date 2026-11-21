const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch(e) {}

const mongoose = require('mongoose');
require('dotenv').config({ path: 'C:/Users/KRANTI/CRM/server/.env' });

async function updateTemplates() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);

  const EmailTemplate = mongoose.connection.db.collection('emailtemplates');
  const templates = await EmailTemplate.find({}).toArray();
  console.log(`Found ${templates.length} templates in DB.`);

  for (const t of templates) {
    let html = t.htmlContent || t.htmlBody || '';
    let updated = false;

    if (html.includes('₹99') || html.includes('99 rupees') || html.includes('(₹99)')) {
      console.log(`Updating template "${t.name}" to remove 99 references...`);
      html = html.replace(/₹99/g, '{{payable_amount}}');
      html = html.replace(/\(₹99\)/g, '({{payable_amount}})');
      updated = true;
    }

    if (t.name === 'Payment Pending Reminder') {
      console.log('Updating Payment Pending Reminder template with full 10% discount table...');
      html = html.replace(
        /Please complete your enrollment fee.*?via Cashfree/gis,
        'Please complete your enrollment fee (<strong>{{payable_amount}}</strong> with 10% discount applied) securely via Cashfree'
      );
      updated = true;
    }

    if (updated) {
      await EmailTemplate.updateOne(
        { _id: t._id },
        {
          $set: {
            htmlContent: html,
            htmlBody: html,
            updatedAt: new Date()
          }
        }
      );
      console.log(`✓ Template "${t.name}" successfully updated.`);
    }
  }

  // Also update any Deals or Leads that had fee 99 to real price with 10% discount
  const Leads = mongoose.connection.db.collection('leads');
  const Deals = mongoose.connection.db.collection('deals');

  const { calculateCoursePricing } = require('../utils/coursePricing');

  const leads99 = await Leads.find({ $or: [{ value: 99 }, { feeValue: '99' }] }).toArray();
  console.log(`Found ${leads99.length} leads with ₹99 fee.`);
  for (const l of leads99) {
    const p = calculateCoursePricing(l.courseName);
    await Leads.updateOne(
      { _id: l._id },
      { $set: { value: p.finalPrice, feeValue: String(p.finalPrice), catalogPrice: p.basePrice, discountAmount: p.discountAmount } }
    );
  }

  const deals99 = await Deals.find({ value: 99 }).toArray();
  console.log(`Found ${deals99.length} deals with ₹99 value.`);
  for (const d of deals99) {
    const p = calculateCoursePricing(d.title || d.courseName);
    await Deals.updateOne(
      { _id: d._id },
      { $set: { value: p.finalPrice, catalogPrice: p.basePrice, discountAmount: p.discountAmount } }
    );
  }

  console.log('Finished updating templates, leads, and deals in database.');
  await mongoose.disconnect();
}

updateTemplates().catch(console.error);

