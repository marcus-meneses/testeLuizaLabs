export interface inputRecord {
  userId: number;
  userName: string; 
  orderId: number;
  prodId: number;
  value: number;
  date: string;
}

export interface inputRecordList extends Array<inputRecord> {};

export interface rawRegistry {
  id_usuario: number;
  nome: string;
  id_pedido: number;
  id_produto: number;
  valor_produto: number;
  data_compra: string;
}

export interface product {
  product_id: number;
  value: string;
}

export interface order {
  order_id: number;
  total: string;
  date: string;
  products: product[];
}

export interface targetRecord {
  user_id: number;
  name: string;
  orders: order[];
}

export interface insertMessage {
  success: boolean;
  message: string;
  inserted_users: number;
  inserted_orders: number;
  inserted_products: number;
}
