type ProductProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  qty?: number;
};

type SetDataProps = React.Dispatch<React.SetStateAction<ProductProps[]>>;

type OrderType = {
  name: string;
  qty: number;
  subTotal: number;
};

type OrderProps = {
  id: Date;
  orders: OrderType[];
  remark: string;
  subTotal: number;
  total: number;
};

type SetOrderProps = React.Dispatch<React.SetStateAction<Order>>;

type Url = string;
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Params = { [key: string]: string };
type Data = unknown;

type FetchProps = {
  path: Url;
  method: Method;
  headers?: Headers;
  params?: Params;
  data?: Data;
};

type TodoProps = {
  id: string;
  createTime: number;
  content: string;
  status: bolean;
};

type EditTodoProps = {
  id: id;
  createTime: number;
  content: string;
  status: bolean;
  isEditing?: boolean;
};

export {
  ProductProps,
  OrderProps,
  SetDataProps,
  SetOrderProps,
  FetchProps,
  TodoProps,
  EditTodoProps,
};
