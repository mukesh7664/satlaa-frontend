import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import { Table, Popconfirm, message } from "@mui/material";
import Price from "../Price";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";

import {
  cartFetch,
  getCart as getCart_r,
  updateProduct,
} from "../../../redux/reducers/Cart";
import Link from "next/link";

const Default = () => {
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const [state, setState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  const getCartProducts = (data = [], products = []) => {
    const CartAllProducts = [];
    products.map((x) => {
      const array = data.find((y) => y._id == x.product_id);
      if (array) {
        const resData = array;
        const errorArray = [];
        if (x.selectedVariants !== undefined) {
          const priceMath = func.filter_array_in_obj(
            resData.variant_products,
            x.selectedVariants
          );

          if (priceMath[0].visible === false) {
            errorArray.push("Product Not Active");
          } else if (Number(priceMath[0].qty) < Number(x.qty)) {
            errorArray.push("Out Of Stock");
          } else {
            errorArray.push(null);
          }

          CartAllProducts.push({
            _id: resData._id,
            title: resData.title,
            selectedVariants: x.selectedVariants,
            qty: x.qty,
            price: priceMath[0].price,
            before_price: priceMath[0].before_price,
            total_price: x.qty * priceMath[0].price,
            total_discount: x.qty * priceMath[0].before_price,
            error: errorArray,
            seo: resData.seo,
          });
        } else {
          if (resData.isActive === false) {
            errorArray.push("Product Not Active");
          } else if (Number(resData.qty) < Number(x.qty)) {
            errorArray.push("Out Of Stock");
          } else {
            errorArray.push(null);
          }

          CartAllProducts.push({
            _id: resData._id,
            title: resData.title,
            selectedVariants: x.selectedVariants,
            qty: x.qty,
            price: resData.price,
            before_price: resData.before_price,
            total_price: x.qty * resData.price,
            total_discount: x.qty * resData.before_price,
            error: errorArray,
            seo: resData.seo,
          });
        }
      }
    });

    setState(
      CartAllProducts.sort(
        (a, b) =>
          (a.price + a.seo + JSON.stringify(a.selectedVariants)).length -
          (b.price + b.seo + JSON.stringify(b.selectedVariants)).length
      )
    );
  };

  const cartProductUpdate = (data, post, messageStr = "Product Update!") => {
    if (isAuthenticated) {
      post.created_user = {
        name: user.name,
        id: user.id,
      };
      post.customer_id = user.id;
      axios
        .post(`${API_URL}/cart/${cart._id}`, post)
        .then(async () => {
          message.success({ content: messageStr, duration: 3 });
          await dispatch(getCart_r(user.id));
          setIsLoaded(false);
        })
        .catch((err) => {
          message.error({
            content: "Some Error, Please Try Again",
            duration: 3,
          });
          console.log(err);
        });
    } else {
      message.success({ content: messageStr, duration: 3 });
      dispatch(updateProduct(data));
      // getProducts();
      setIsLoaded(false);
    }
  };

  /*const plusProduct = (dataRecord) => {
    seTisLoaded(true);

    const productsDataArray = cart.products;
    const productsData = [];
    const variantControl = productsDataArray.find(
       (x) =>
          x.product_id == dataRecord._id &&
      JSON.stringify(x.selectedVariants) ==
      JSON.stringify(dataRecord.selectedVariants)
    );
    const variantControlNot = productsDataArray.filter(
       (x) =>
          x.product_id != dataRecord._id ||
      JSON.stringify(x.selectedVariants) !=
      JSON.stringify(dataRecord.selectedVariants)
    );
    productsData.push(...variantControlNot, {
       product_id: dataRecord._id,
       selectedVariants: dataRecord.selectedVariants,
       qty: variantControl.qty + 1,
       seo: dataRecord.seo,
    });
    const post = {
       created_user: {
          name: user.name,
          id: user.id,
       },
       customer_id: user.id,
       products: productsData,
    };

    cartProductUpdate(post);
 };
 
  const notPlusProduct = (dataRecord) => {
    seTisLoaded(true);
    const productsDataArray = cart.products;
    const productsData = [];
    const variantControl = productsDataArray.find(
      (x) =>
        x.product_id == dataRecord._id &&
        JSON.stringify(x.selectedVariants) ==
          JSON.stringify(dataRecord.selectedVariants)
    );
    const variantControlNot = productsDataArray.filter(
      (x) =>
        x.product_id != dataRecord._id ||
        JSON.stringify(x.selectedVariants) !=
          JSON.stringify(dataRecord.selectedVariants)
    );

    productsData.push(...variantControlNot, {
      product_id: dataRecord._id,
      selectedVariants: dataRecord.selectedVariants,
      qty: variantControl.qty > 1 ? variantControl.qty - 1 : variantControl.qty,
      seo: dataRecord.seo,
    });

    const post = {
      created_user: {
        name: user.name,
        id: user.id,
      },
      customer_id: user.id,
      products: productsData,
    };

    cartProductUpdate(post);
  };
 */

  const getProducts = async () => {
    if (cart.products?.length > 0) {
      const arrayId = [];
      cart.products?.map((x) => {
        arrayId.push(x.product_id);
      });
      await axios
        .post(`${API_URL}/cart/allproducts`, { _id: arrayId })
        .then((res) => {
          getCartProducts(res.data, cart.products);
        });
    }
  };

  useEffect(() => {
    getProducts();
  }, [cart]);

  
  const deleteProduct = (dataRecord) => {
    setIsLoaded(true);

    const productsDataArray = cart.products;
    const productsData = [];
   
    const variantControlNot = productsDataArray.filter(
      (x) =>
        x.product_id != dataRecord._id ||
        JSON.stringify(x.selectedVariants) !=
          JSON.stringify(dataRecord.selectedVariants)
    );
    productsData.push(...variantControlNot);
    const post = {
      created_user: {
        name: user.name,
        id: user.id,
      },
      customer_id: user.id,
      products: productsData,
    };
    let data = { product: dataRecord, qty: 0 };
    cartProductUpdate(data, post);
  };

  const incrementQuantity = (dataRecord) => {
    setIsLoaded(true);
    const productsDataArray = cart.products;
    const productsData = [];
    const variantControl = productsDataArray.find(
      (x) =>
        x.product_id == dataRecord._id &&
        JSON.stringify(x.selectedVariants) ==
          JSON.stringify(dataRecord.selectedVariants)
    );
    const variantControlNot = productsDataArray.filter(
      (x) =>
        x.product_id != dataRecord._id ||
        JSON.stringify(x.selectedVariants) !=
          JSON.stringify(dataRecord.selectedVariants)
    );
    productsData.push(...variantControlNot, {
      product_id: dataRecord._id,
      selectedVariants: dataRecord.selectedVariants,
      qty: variantControl.qty + 1,
      price: variantControl.price,
      seo: variantControl.seo,
      sku:variantControl.sku,
    });
    const post = {
      created_user: {
        name: user.name,
        id: user.id,
      },
      customer_id: user.id,
      products: productsData,
    };
    let data = { product: dataRecord, qty: variantControl.qty + 1 };
    cartProductUpdate(data, post);
  };

  const decrementQuantity = (dataRecord) => {
    setIsLoaded(true);
    const productsDataArray = cart.products;
    const productsData = [];
    const variantControl = productsDataArray.find(
      (x) =>
        x.product_id == dataRecord._id &&
        JSON.stringify(x.selectedVariants) ==
          JSON.stringify(dataRecord.selectedVariants)
    );
    const variantControlNot = productsDataArray.filter(
      (x) =>
        x.product_id != dataRecord._id ||
        JSON.stringify(x.selectedVariants) !=
          JSON.stringify(dataRecord.selectedVariants)
    );

    productsData.push(...variantControlNot, {
      product_id: dataRecord._id,
      selectedVariants: dataRecord.selectedVariants,
      qty: variantControl.qty > 1 ? variantControl.qty - 1 : variantControl.qty,
      seo: dataRecord.seo,
    });

    const post = {
      created_user: {
        name: user.name,
        id: user.id,
      },
      customer_id: user.id,
      products: productsData,
    };

    let data = { product: dataRecord, qty: variantControl.qty - 1 };
    cartProductUpdate(data, post);
  };

  return (
    <>
      <Table
        pagination={false}
        loading={isLoaded}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text, record) => {
              const errorArray = [];
              record.error.map((x) => {
                errorArray.push(<div className="text-xs "> {x} </div>);
              });

              const variants = [];

              for (const property in record.selectedVariants) {
                variants.push(
                  <div className="text-xs ">
                    {" "}
                    <span className="font-semibold"> {property}</span>:{" "}
                    {record.selectedVariants[property]}{" "}
                  </div>
                );
              }

              return (
                <span className="link">
                  <div className="float-left mb-5 w-full">
                    <span className="float-right text-right sm:hidden ">
                      <Popconfirm
                        placement="left"
                        title="Are You Sure?"
                        onConfirm={() => {
                          deleteProduct(record);
                        }}
                      >
                        <a>
                          <DeleteOutlineIcon
                            style={{ fontSize: "150%", marginLeft: "15px" }}
                          />{" "}
                        </a>
                      </Popconfirm>
                    </span>
                    <div className="flex flex-col">
                      <Link
                        href={`/products/${record.seo}`}
                        className="font-semibold"
                      >
                        {text}
                      </Link>
                      <div className="text-red-500 float-left">
                        {errorArray}
                      </div>
                    </div>
                    {variants.length > 0 ? <> {variants}</> : <> </>}
                  </div>
                  <div className=" float-left sm:hidden flex flex-row h-10  my-2 rounded w-24 relative bg-transparent border-gray-200 border  ">
                    <button
                      data-action="decrement"
                      className=" bg-white text-gray-700 hover:text-black hover:bg-primary  h-full w-20 rounded-l cursor-pointer outline-none"
                      onClick={() => {
                        decrementQuantity(record);
                      }}
                    >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                      type="number"
                      className="outline-none  hiddenArrowInputNumber focus:outline-none text-center w-full bg-white font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  "
                      name="custom-input-number"
                      value={record.qty}
                    ></input>
                    <button
                      data-action="increment"
                      className="bg-white text-gray-700 hover:text-black hover:bg-primary h-full w-20 rounded-r cursor-pointer"
                      onClick={() => {
                        incrementQuantity(record);
                      }}
                    >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>

                  <div className="text-center float-right sm:hidden  ">
                    <span className=" text-md line-through">
                      {" "}
                      {record.total_discount != 0 ? (
                        <Price data={record.total_discount} />
                      ) : (
                        ""
                      )}
                    </span>
                    <div className=" text-lg text-primary">
                      <Price data={record.total_price} />
                    </div>
                  </div>
                </span>
              );
            },
          },

          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            className: "hidden sm:table-cell ",
            render: (text, record) => (
              <div className="text-center  ">
                <span className=" text-md line-through">
                  {record.before_price != 0 ? (
                    <Price data={record.before_price} />
                  ) : (
                    ""
                  )}
                </span>
                <div className=" text-sm ">
                  <Price data={record.price} />
                </div>
              </div>
            ),
          },

          {
            title: "Qty",
            dataIndex: "action",
            key: "action",
            className: "hidden sm:table-cell ",
            render: (text, record) => (
              <>
                <div className="flex flex-row h-10  rounded w-24 relative bg-transparent border-gray-200 border mt-1">
                  <button
                    data-action="decrement"
                    className=" bg-white text-gray-700 hover:text-black hover:bg-primary  h-full w-20 rounded-l cursor-pointer outline-none"
                    onClick={() => {
                      decrementQuantity(record);
                    }}
                  >
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none  hiddenArrowInputNumber focus:outline-none text-center w-full bg-white font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  "
                    name="custom-input-number"
                    value={record.qty}
                  ></input>
                  <button
                    data-action="increment"
                    className="bg-white text-gray-700 hover:text-black hover:bg-primary h-full w-20 rounded-r cursor-pointer"
                    onClick={() => {
                      incrementQuantity(record);
                    }}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </>
            ),
          },
          {
            title: "Total Price",
            dataIndex: "total_price",
            key: "total_price",
            className: "hidden sm:table-cell ",
            render: (text, record) => (
              <div className="text-center">
                <span className=" text-md line-through">
                  {" "}
                  {record.total_discount != 0 ? (
                    <Price data={record.total_discount} />
                  ) : (
                    ""
                  )}
                </span>
                <div className=" text-lg text-primary">
                  <Price data={record.total_price} />
                </div>
              </div>
            ),
          },

          {
            title: "Delete",
            dataIndex: "action",
            key: "action",
            className: "hidden sm:table-cell ",
            render: (text, record) => (
              <Popconfirm
                placement="left"
                title="Are You Sure?"
                onConfirm={() => {
                  deleteProduct(record);
                }}
              >
                <a>
                  <DeleteOutlineIcon
                    style={{ fontSize: "150%", marginLeft: "15px" }}
                  />{" "}
                </a>
              </Popconfirm>
            ),
          },
        ]}
        dataSource={[...state]}
      />
    </>
  );
};

export default Default;
