import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Button } from "./ui/button";

import { POST, getCookie, rmCookie } from "@/lib/utils";

import { ReactComponent as Logo } from "@/assets/logo.svg";

function NavBar() {
  const [isLoading, setIsLoading] = useState(false);
  const nickname = getCookie("nickname");
  const navigate = useNavigate();
  const handleLoginOut = async () => {
    setIsLoading(true);
    const res = await POST({ path: "/users/sign_out" });
    if (res.status) {
      toast.success(res.message);
      rmCookie("token");
      rmCookie("nickname");
      rmCookie("apiChecked");
      navigate("/");
      setIsLoading(false);
    }
    if (!res.status) {
      toast.error(res.message);
      setIsLoading(false);
    }
  };

  return (
    <nav className="flex items-center justify-between">
      <Logo className="cursor-pointer" onClick={() => navigate("/")} />
      <div className="flex items-center gap-6">
        <h2>{nickname}的待辦</h2>
        <Button
          disabled={isLoading}
          variant={isLoading ? "outline" : "link"}
          onClick={() => handleLoginOut()}
        >
          {isLoading && <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />}
          登出
        </Button>
      </div>
    </nav>
  );
}

export default NavBar;
