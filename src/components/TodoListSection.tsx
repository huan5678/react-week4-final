import { Checkbox } from "./ui/checkbox";
import { BsXLg, BsPencilSquare } from "react-icons/bs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DELETE, PATCH, PUT } from "@/lib/utils";
import { EditTodoProps, TodoProps } from "@/type";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function TodoList({
  query,
  todos,
  handleGetTodo,
}: {
  query: string;
  todos: TodoProps[];
  handleGetTodo: () => Promise<void>;
}) {
  const [editTodo, setEditTodo] = useState<EditTodoProps[]>([]);
  const [resultList, setResultList] = useState<TodoProps[]>([]);

  useEffect(() => {
    if (todos.length === 0) return;
    setResultList(
      todos.filter((todo) => {
        if (query === "isFinish") return todo.status === true;
        if (query === "unFinish") return todo.status === false;
        return todo;
      })
    );
    setEditTodo(
      todos.map((todo) => ({
        ...todo,
        isEditing: false,
      }))
    );
  }, [todos, query]);

  const handleRemoveTodo = async (id: string) => {
    const res = await DELETE(`/todos/${id}`);
    if (res.status) {
      toast.success(res.message);
      handleGetTodo();
    }
    if (!res.status) {
      toast.error(res.message);
    }
  };

  const handleEditTodo = (todo: TodoProps, content?: string) => {
    setEditTodo((prev) => {
      const idx = prev.findIndex((item) => item.id === todo.id);
      const result = [...prev];
      result[idx] = {
        id: todo.id,
        createTime: todo.createTime,
        content: content || todo.content,
        status: todo.status,
        isEditing: true,
      };
      return result;
    });
  };

  const handleCannelEdit = (id: string) => {
    setEditTodo((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      const result = [...prev];
      result[idx].isEditing = false;
      return result;
    });
  };

  const handleUpdateTodo = async (todo: TodoProps) => {
    const idx = editTodo.findIndex((item) => item.id === todo.id);

    const res = await PUT({
      path: `/todos/${todo.id}`,
      data: {
        content: editTodo[idx].content,
      },
    });
    if (res.status) {
      toast.success(res.message);
      handleGetTodo();
    }
    if (!res.status) {
      toast.error(res.message);
    }
  };

  const handleCheckTodo = async (e: CheckedState, id: string) => {
    const res = await PATCH(`/todos/${id}/toggle`);
    if (res.status) {
      toast.success(res.message);
      handleGetTodo();
    }
    if (!res.status) {
      toast.error(res.message);
    }
  };

  const handleClearFinish = async () => {
    const finishList = resultList
      .filter((todo) => todo.status === true)
      .map((todo) => DELETE(`/todos/${todo.id}`));
    Promise.all(finishList).then((res) => {
      const statusList = res.filter((result) => result.status);
      if (statusList.length === finishList.length) {
        toast.success("已清除所有已完成項目");
        handleGetTodo();
      }
    });
  };
  return (
    <ul className="flex flex-col gap-4 p-4 md:p-6">
      {resultList.map((todo, index) => (
        <li key={todo.id} className="space-y-2 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex flex-col flex-auto gap-4 pb-4 border-b">
              <div className="flex items-center gap-4">
                <Checkbox
                  className="accent-[#FFD370]"
                  value={todo.status}
                  defaultChecked={todo.status}
                  onCheckedChange={(e) => handleCheckTodo(e, todo.id)}
                />
                <div
                  className={`flex-none ${
                    todo.status ? "line-through text-[#9F9A91]" : null
                  }`}
                >
                  {todo.content}
                </div>
                <Button
                  className={`ml-auto ${
                    editTodo[index].isEditing ? "hidden" : ""
                  }`}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditTodo(todo)}
                >
                  <BsPencilSquare className="w-5 h-5" />
                </Button>
              </div>
              {editTodo
                .filter((item) => item.id === todo.id)
                .map((currentTodo) => (
                  <div
                    key={currentTodo.id}
                    className={`gap-4 ${
                      currentTodo.isEditing ? "flex flex-wrap" : "hidden"
                    }`}
                  >
                    <Input
                      id={todo.id}
                      className="flex-auto"
                      value={currentTodo.content}
                      onChange={(e) =>
                        handleEditTodo(currentTodo, e.target.value)
                      }
                      type="text"
                    />
                    <Button
                      className="flex-auto hover:bg-blue-800"
                      type="button"
                      onClick={() => handleUpdateTodo(todo)}
                    >
                      確認修改
                    </Button>
                    <Button
                      className="flex-auto hover:bg-white hover:border-red-500 hover:text-red-500"
                      type="button"
                      variant={"outline"}
                      onClick={() => handleCannelEdit(todo.id)}
                    >
                      取消修改
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              className="ml-auto"
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTodo(todo.id)}
            >
              <BsXLg className="w-5 h-5" />
            </Button>
          </div>
        </li>
      ))}
      <li className="flex items-center justify-between">
        <h3>
          {resultList.length} 個{" "}
          {query === "isFinish" ? "已完成項目" : "待完成項目"}
        </h3>
        <Button
          type="button"
          variant="ghost"
          onClick={handleClearFinish}
          className={`${query === "unFinish" && "hidden"} text-[#9F9A91]`}
          disabled={
            resultList.filter((todo) => todo.status === true).length === 0
          }
        >
          清除已完成項目
        </Button>
      </li>
    </ul>
  );
}

export default TodoList;
