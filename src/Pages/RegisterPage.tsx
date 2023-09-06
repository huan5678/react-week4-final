import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { POST } from "@/lib/utils";
import { ReactComponent as Logo } from "@/assets/logo.svg";
import { ReactComponent as Cover } from "@/assets/cover.svg";

const registerFormSchema = z.object({
  email: z.string().email({
    message: "請輸入正確的Email格式",
  }),
  password: z.string().min(6, {
    message: "密碼長度最少6個字元",
  }),
  confirm: z.string().min(6, {
    message: "密碼長度最少6個字元",
  }),
  nickname: z.string().min(1, {
    message: "請輸入暱稱",
  }),
}).required().refine((data) => data.password === data.confirm, {
  message: "請確認兩次輸入的密碼均為相同",
  path: [ "confirm" ],
});

function RegisterPage() {
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
  });

  async function handleOnSubmit(data: z.infer<typeof registerFormSchema>)
  {
    const { email, password, nickname } = data;
    setIsLoading(true);
    const res = await POST({
      path: "/users/sign_up",
      data: {
        email,
        nickname,
        password,
      },
    });
    if (res.status) {
      toast.success("成功註冊帳號");
      form.reset();
      setIsLoading(false);
      navigate("/login");
    }
    if (!res.status) {
      toast.error(res.message);
      setIsLoading(false);
    }
  }

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
              註冊帳號
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
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>您的暱稱</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        className="h-12 px-4 py-3 bg-white"
                        placeholder="請輸入您的暱稱"
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
                    <FormLabel>密碼</FormLabel>
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
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>再次輸入密碼</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        className="h-12 px-4 py-3 bg-white"
                        placeholder="請再次輸入密碼"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center gap-6 pt-4">
                <Button type="submit" disabled={isLoading} className="">
                  註冊帳號
                </Button>
                <Button type="button" disabled={isLoading} variant="link" className="" onClick={() => navigate('/login')}>
                  登入
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
