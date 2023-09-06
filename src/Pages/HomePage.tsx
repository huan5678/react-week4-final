import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import { handleOnCheckout } from "@/lib/utils";
import { toast } from "sonner";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkout() {
      const res = await handleOnCheckout();
      if (res.status) {
        toast.success(`Hi ~ ${res.nickname} 歡迎回來`);
        navigate("/todo");
      }
      if (!res.status) {
        navigate("/login");
      }
    }
    checkout();
  }, []);

  return (
    <div className="bg-[#FFD370] min-h-screen grid place-content-center">
      <BiLoaderAlt className="text-6xl animate-spin" />
    </div>
  );
}

export default HomePage;
