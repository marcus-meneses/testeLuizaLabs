interface inputRecord {
  userId: number;
  userName: string; 
  orderId: number;
  prodId: number;
  value: number;
  date: string;
}

type inputRecordList = inputRecord[];

interface product {
  product_id: number;
  value: number;
}

interface order {
  order_id: number;
  total: number;
  date: string;
  products: product[];
}


interface targetRecord {
  user_id: number;
  name: string;
  orders: order[];
}
