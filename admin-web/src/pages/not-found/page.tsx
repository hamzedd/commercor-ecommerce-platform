import { useNavigate } from "react-router";
import { useEffect } from "react";

function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin");
  }, [navigate]);

  return <div>redirect</div>;
}

export default NotFoundPage;
