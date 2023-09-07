import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlusSmall } from "react-icons/hi2";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GET, POST, handleOnCheckout, getCookie } from "@/lib/utils";
import { TodoProps } from "@/type";

import { ReactComponent as Cover } from "@/assets/todoCover.svg";
import TodoList from "@/components/TodoListSection";

function TodoPage() {
  const [todo, setTodo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectTab, setSelectTab] = useState("allTodos");
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const navigate = useNavigate();

  const handleGetTodo = async () => {
    const res = await GET("/todos/");
    if (res.status) {
      setTodos(res.data);
    }
    if (!res.status) {
      toast.error(res.message);
    }
  };

  const handleCreateTodo = async () => {
    if (!todo) {
      toast.error("請確認輸入內容");
      return;
    }
    setIsLoading(true);
    const res = await POST({
      path: "/todos/",
      data: {
        content: todo,
      },
    });
    if (res.status) {
      toast.success("成功新增待辦事項");
      setTodo("");
      setIsLoading(false);
      handleGetTodo();
    }
    if (!res.status) {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    async function checkout() {
      const res = await handleOnCheckout();
      if (res.status) {
        toast.success(`Hi ~ ${res.nickname} 歡迎回來`);
        handleGetTodo();
      }
      if (!res.status) {
        navigate("/login");
      }
    }
    if (getCookie("apiChecked") === "true") {
      handleGetTodo();
    } else {
      checkout();
    }
  }, []);

  const tabList = useMemo(() => {
    return [
      {
        id: 1,
        name: "全部項目",
        val: "allTodos",
      },
      {
        id: 2,
        name: "已完成項目",
        val: "isFinish",
      },
      {
        id: 3,
        name: "未完成項目",
        val: "unFinish",
      },
    ];
  }, []);

  return (
    <>
      <section className="relative pt-4 px-8 min-h-[85vh] bg-[linear-gradient(172.7deg,#FFD370_5.12%,#FFD370_53.33%,#FFD370_53.44%,#FFFFFF_53.45%,#FFFFFF_94.32%)]">
        <NavBar />
        <div className="container w-1/2 pt-4 md:pt-10">
          <div
            className={`relative ${
              todos.length === 0 ? "mb-[3.75rem]" : "mb-4"
            }`}
          >
            <Input
              type="text"
              placeholder="新增待辦事項"
              id="todo"
              name="todo"
              onChange={(e) => setTodo(e.target.value.trim())}
              value={todo}
              pattern=".*\S+.*"
              title="內容不能為空或只包含空白字符"
              disabled={isLoading}
              className="h-12 px-4 py-3 bg-white shadow-[0px_0px_15px_0px_#00000026]"
            />
            <Button
              type="button"
              size="icon"
              className="absolute right-0 -translate-x-2 -translate-y-1/2 top-1/2"
              onClick={handleCreateTodo}
            >
              <HiPlusSmall className="w-6 h-6" />
            </Button>
          </div>
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <h2>目前尚無待辦事項</h2>
              <Cover />
            </div>
          ) : (
            <div className="flex flex-col rounded-[0.625rem] bg-white overflow-hidden shadow-[0px_0px_15px_0px_#00000026]">
              <div className="flex items-center justify-between">
                {tabList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`flex-1 py-4 border-b-2 font-bold text-sm ${
                      selectTab === item.val
                        ? "border-black"
                        : "border-[#EFEFEF]] text-[#9F9A91]"
                    }`}
                    onClick={() => setSelectTab(item.val)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <TodoList
                query={selectTab}
                todos={todos}
                handleGetTodo={handleGetTodo}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default TodoPage;
