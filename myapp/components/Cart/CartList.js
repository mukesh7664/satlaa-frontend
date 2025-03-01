import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import Price from "../Price";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { getCart as getCart_r, updateProduct } from "../../../redux/reducers/Cart";
import Link from "next/link";

const Default = () => {
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const [state, setState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  const getCartProducts = (data = [], products = []) => {
    const CartAllProducts = [];
    products.forEach((x) => {
      const productData = data.find((y) => y._id === x.product_id);
      if (productData) {
        const errorArray = [];
        let priceData = productData;
        if (x.selectedVariants) {
          priceData = func.filter_array_in_obj(
            productData.variant_products,
            x.selectedVariants
          )[0];
          if (!priceData.visible) errorArray.push("Product Not Active");
          else if (priceData.qty < x.qty) errorArray.push("Out Of Stock");
        } else {
          if (!productData.isActive) errorArray.push("Product Not Active");
          else if (productData.qty < x.qty) errorArray.push("Out Of Stock");
        }

        CartAllProducts.push({
          _id: productData._id,
          title: productData.title,
          selectedVariants: x.selectedVariants || [],
          qty: x.qty,
          price: priceData.price,
          before_price: priceData.before_price || 0,
          total_price: x.qty * priceData.price,
          total_discount: x.qty * priceData.before_price,
          error: errorArray,
          seo: productData.seo || "", // Ensure seo is always defined
        });
      }
    });
    setState(CartAllProducts);
  };

  const cartProductUpdate = (data, post, messageStr = "Product Updated!") => {
    if (isAuthenticated) {
      post.created_user = { name: user.name, id: user.id };
      post.customer_id = user.id;
      axios.post(`${API_URL}/cart/${cart._id}`, post)
        .then(async () => {
          await dispatch(getCart_r(user.id));
          setIsLoaded(false);
        })
        .catch(() => {
          console.error("Error updating cart");
        });
    } else {
      dispatch(updateProduct(data));
      setIsLoaded(false);
    }
  };

  const getProducts = async () => {
    if (cart.products?.length > 0) {
      const productIds = cart.products.map((x) => x.product_id);
      axios.post(`${API_URL}/cart/allproducts`, { _id: productIds })
        .then((res) => {
          getCartProducts(res.data, cart.products);
        });
    }
  };

  useEffect(() => {
    getProducts();
  }, [cart]);

  const modifyQuantity = (dataRecord, delta) => {
  
    if (!dataRecord || !dataRecord._id) {
      console.error("modifyQuantity received invalid dataRecord:", dataRecord);
      return;
    }
  
    setIsLoaded(true);
  
    // Ensure cart.products exists
    if (!cart.products || cart.products.length === 0) {
      console.error("Cart products not found.");
      setIsLoaded(false);
      return;
    }
  
    // Update the quantity while ensuring it does not go below 1
    const updatedProducts = cart.products.map((item) => {
      if (
        item.product_id === dataRecord._id &&
        JSON.stringify(item.selectedVariants) === JSON.stringify(dataRecord.selectedVariants)
      ) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
  
    // Calculate updated total price
    const updatedTotalPrice = dataRecord.price * Math.max(1, dataRecord.qty + delta);
    const updatedTotalDiscount = dataRecord.before_price * Math.max(1, dataRecord.qty + delta);
  
    const updatedCart = {
      created_user: { name: user.name, id: user.id },
      customer_id: user.id,
      products: updatedProducts,
    };
  
    const updatedProductData = {
      product: {
        product_id: dataRecord._id,
        title: dataRecord.title,
        selectedVariants: dataRecord.selectedVariants || [],
        price: dataRecord.price,
        before_price: dataRecord.before_price,
        total_price: updatedTotalPrice,
        total_discount: updatedTotalDiscount,
        seo: dataRecord.seo,
        error: dataRecord.error,
      },
      qty: Math.max(1, dataRecord.qty + delta),
    };
  
    cartProductUpdate(updatedProductData, updatedCart);
  };  

  const deleteProduct = (dataRecord) => {
    setIsLoaded(true);

    const productsDataArray = cart.products;
    const productsData = [];
   
    const variantControlNot = productsDataArray.filter(
      (x) =>
        x.product_id !== dataRecord._id ||
        JSON.stringify(x.selectedVariants) !==
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

  return (
    <TableContainer component={Paper} className="w-100">
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#f5f5f5" }}>
            <TableCell>
              <Typography variant="body2" fontWeight="bold">Title</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body2" fontWeight="bold">Price</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body2" fontWeight="bold">Qty</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body2" fontWeight="bold">Total Price</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body2" fontWeight="bold">Delete</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.length > 0 ? (
            state.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  <Link href={`/products/${record.seo}`} passHref>
                    <Typography variant="body1" fontWeight="bold">{record.title}</Typography>
                  </Link>
                  {record.error.length > 0 && (
                    <Typography variant="caption" color="error">
                      {record.error.join(", ")}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {record.before_price !== 0 && (
                    <Typography variant="body2" color="textSecondary" sx={{ textDecoration: "line-through" }}>
                      <Price data={record.before_price} />
                    </Typography>
                  )}
                  <Typography variant="body1" fontWeight="bold">
                    <Price data={record.price} />
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button variant="outlined" onClick={() => modifyQuantity(record, -1)}>-</Button>
                    <Typography variant="body1" component="span" sx={{ mx: 1 }}>
                      {record.qty}
                    </Typography>
                    <Button variant="outlined" onClick={() => modifyQuantity(record, 1)}>+</Button>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" fontWeight="bold">
                    <Price data={record.total_price} />
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => deleteProduct(record)}>
                    <MdDeleteOutline />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body1">No products in cart.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Default;