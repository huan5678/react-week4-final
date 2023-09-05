import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { POST, handleOnCheckout, setCookie, getCookie } from "@/lib/utils";
import { ReactComponent as Logo } from "@/assets/logo.svg";
import { ReactComponent as Cover } from "@/assets/cover.svg";

const loginFormSchema = z
  .object({
    email: z.string().email({
      message: "請輸入正確的Email格式",
    }),
    password: z.string().min(6, {
      message: "密碼長度最少6個字元",
    }),
  })
  .required();

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleOnSubmit(data: z.infer<typeof loginFormSchema>) {
    const { email, password } = data;
    setIsLoading(true);
    const res = await POST({
      path: "/users/sign_in",
      data: { email, password },
    });
    if (res.status) {
      toast.success(`Hi ~ ${res.nickname} 歡迎回來`);
      setCookie({
        name: "token",
        content: res.token,
        expiryDays: res.exp,
      });
      setCookie({
        name: "nickname",
        content: res.nickname,
        expiryDays: res.exp,
      });
      navigate("/todo");
      setIsLoading(false);
    }
    if (!res.status) {
      toast.error(res.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function checkout() {
      const res = await handleOnCheckout();
      if (res.status) {
        toast.success(`Hi ~ ${res.nickname} 歡迎回來`);
        navigate("/todo");
      }
    }
    if (getCookie("apiChecked") === "true") {
      navigate("/todo");
    } else {
      checkout();
    }
  }, []);

  return (
    <section className="bg-[#FFD370]">
      <div className="grid md:flex md:mx-auto place-content-center pt-12 justify-center md:justify-between items-center gap-4 md:max-w-[49.75rem] min-h-screen">
        <div>
          <Logo className="mb-4 md:mx-auto" />
          <Cover className="hidden md:block" />
        </div>
        <div className="md:min-w-[19rem]">
          <Form {...form}>
            <h1 className="flex-auto md:max-w-[19rem] font-bold text-center md:text-left text-xl mb-8">
              最實用的線上代辦事項服務
            </h1>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-4 mb-7"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={isLoading}
                        className="h-12 px-4 py-3 bg-white"
                        placeholder="請輸入Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        className="h-12 px-4 py-3 bg-white"
                        placeholder="請輸入密碼"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center gap-6 pt-4">
                <Button type="submit" disabled={isLoading} className="">
                  登入
                </Button>
                <Button
                  type="button"
                  disabled={isLoading}
                  variant="link"
                  className=""
                  onClick={() => navigate("/register")}
                >
                  註冊
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
