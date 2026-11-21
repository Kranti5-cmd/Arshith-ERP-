"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "react-bootstrap";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <Spinner animation="border" variant="primary" className="mb-3" />
      <div className="text-secondary fw-semibold">Opening Finance Workspace...</div>
    </div>
  );
}
