
// localStorage.setItem("key","value");//存储变量名为key，值为value的变量 

// localStorage.getItem("key");//获取存储的变量key的值

// localStorage.removeItem("key")//删除变量名为key的存储变量


//商品类
class Product {
  constructor(id, title, imgSrc, price) {
    // 商品类的成员
    this.id = id;
    this.title = title;
    this.imgSrc = imgSrc;
    this.price = price;
  }
}
//订单类
class Order {
  constructor(product, qty, selectStatus) {
    this.id = product.id;
    this.title = product.title;  //具体的商品信息
    this.imgSrc = product.imgSrc;
    this.price = product.price;
    this.qty = qty;
    this.selectStatus = selectStatus;//选择状态
  }
}

// 购物车数据类，用于记录购物车数据
//包括订单列表，总计商品数量，总计商品样本数，总价格
//订单列表项包括：某类商品，商品数量小计
//商品包括：商品的id，图片，名称，单价
class CartData {
  constructor() {
    this.orderList = new Array();
    this.units = 0;
    this.totalQty = 0;
    this.totalAmount = 0
  }
}


//购物车操作类
class ShoppingCart {


  //清楚购物车
  clearCart() {
    localStorage.removeItem('lzzyCart');
  }

  //从本地存储中获取购物车的数据
  getDataFromLocalStorage() {
    // return localStorage.getItem('test');

    let lzzyCart = localStorage.getItem('lzzyCart');
    //判断购物车是否为空
    if (lzzyCart == null || lzzyCart == '') {
      return new CartData();
    }
    else {
      return JSON.parse(lzzyCart);
    }
  }


  //将购物车数据写入本地存储中
  setDataToLocalSatorge(cartData) {
    // var cartDataString = JSON.stringify(cartData);//将cartData转换为JSON字符串
    // localStorage.setItem('test', cartDataString);  //test可以自己随便定义
    //清楚原有存储写入新的列表
    localStorage.removeItem('lzzyCart');

    //写入本地存储
    localStorage.setItem('lzzyCart', JSON.stringify(cartData));


  }


  //获取选中对象的订单列表
  getSelectedList() {
    // 从本地存储中获取购物车的数据
    let cartData = this.getDataFromLocalStorage();
    let selectArray = new Array();
    let orderList = cartData.orderList;
    for (const key in orderList) {
      const order = orderList[key];
      if (order.selectStatus) {
        selectArray.push(order);
      }
    }
    return selectArray;
  }

  //获取选中对象列表的总数量
  getSelectedQty() {
    let selectedqty = 0
    let cartData = this.getDataFromLocalStorage();//获取购物车数据
    let orderList = cartData.orderList;//获取订单列表
    for (let i in orderList) {
      if (orderList[i].selectStatus) {
        //如果新加入订单商品已经在购物车中,则变更订单列表对应的商品数
        selectedqty += orderList[i].qty;//新增对应的数量cont
      }
    }
    return selectedqty;
  }
  //获取选中对象列表的总价格
  getSelectedAmount() {
    let selectedAmount = 0
    let cartData = this.getDataFromLocalStorage();
    let orderList = cartData.orderList;
    for (let i in orderList) {
      if (orderList[i].selectStatus) {
        //如果新加入订单商品已经在购物车中,则变更订单列表对应的商品数
        selectedAmount += orderList[i].qty * orderList[i].price;//新增对应的数量cont
      }
    }
    return selectedAmount;
  }

  //添加购物车
  addToCart(order) {
    //从本地存储中获取购物车数据
    let cartData = this.getDataFromLocalStorage();
    //获取购物车的JSON数据中的订单列表
    let orderList = cartData.orderList; //orderList前面的是变量后面的是属性
    //设置标志位判断是否为购物车新商品,默认为是新商品
    let isNewProduct = true;
    //遍历订单列表,判断新加入的商品是否在购物车中
    // for (let i = 0; i < orderList.length; i++)
    for (let i in orderList) {
      if (order.id == orderList[i].id) {
        //如果新加入订单商品已经在购物车中,则变更订单列表对应的商品数
        orderList[i].qty += order.qty;//新增对应的数量cont
        isNewProduct = false;
        break;
      }
    }
    //如果是新商品
    if (isNewProduct) {//新商品，order是购物车中的新商品，给样本数++
      orderList.push(order);//导入新商品置入购物车
      cartData.units++;//总样本+1
    }
    //修改购物车总金额及商品总数量
    cartData.totalQty += order.qty;
    cartData.totalAmount += order.price * order.qty;

    //写入LocalSatorge
    this.setDataToLocalSatorge(cartData);

  }

  //设置购物车订单项选择状态
  setItemSelectStatus(id, selectStatus) {
    let cartData = this.getDataFromLocalStorage();//获取购物车数据
    let orderList = cartData.orderList;//获取订单列表
    //查找id在orderList中指定的位置
    let order = this.find(id, orderList);
    if (order == null) {
      //没有找到id
      console.log('订单id有误');
    }
    else {
      //找到对应的id
      order.selectStatus = selectStatus;
    }
    //写入本地存储
    this.setDataToLocalSatorge(cartData);
  }
  //查找制定的id在购物车数据列表中的位置
  find(id, orderList) {
    for (const i in orderList) {
      if (id == orderList[i].id) {
        // console.log(orderList[i]);
        return orderList[i];
      }
    }
    return null;
  }
  //删除订单
  deleteItem(id) {
    let cartData = this.getDataFromLocalStorage();
    //获取购物车的JSON数据中的订单列表
    let orderList = cartData.orderList;
    //获取指定的id订单(要删除的订单)
    let order = this.find(id, orderList);
    //定位要删除的订单在数组中的位置
    let index = orderList.indexOf(order, 0);
    if (index == null) {
      //没有找到id
      console.log('订单id有误');
    }
    else {
      //删除当前订单
      orderList.splice(index, 1);
      //变更总商品总件数
      cartData.totalQty -= order.qty;
      //变更总商品总价格
      cartData.totalAmount -= order.qty * order.price;
      //变更总商品总件数
      cartData.units--;
      //数据回写购物车
      this.setDataToLocalSatorge(cartData);
    }
  }
  //减少/增加指定商品的数量（+1或者-1）
  changeQty(id, a) {
    let cartData = this.getDataFromLocalStorage();//获取购物车数据
    // console.log(cartData);
    for (let i = 0; i < cartData.orderList.length; i++) {
      if (id == cartData.orderList[i].id) {
        if (a == '-') {
          cartData.orderList[i].qty--;
          cartData.totalQty--;
          cartData.totalAmount -= cartData.orderList[i].price;
          if (cartData.orderList[i].qty == 0) {
            cartData.orderList.splice(i, 1);
            cartData.units--;
          }
        } if (a == '+') {
          cartData.orderList[i].qty++;
          cartData.totalQty++;
          cartData.totalAmount += cartData.orderList[i].price;
        }
      }
    }
    this.setDataToLocalSatorge(cartData);
  }

}



