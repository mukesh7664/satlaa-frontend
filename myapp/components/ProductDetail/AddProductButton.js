"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Fixed import for App Router
import { cartFetch } from "../../../redux/reducers/Cart";
import axiosInstance from "@/util/axios";
import { API_URL } from "../../../config";
import Loader from "@/components/Utils/Loader";
import TagManager from "react-gtm-module";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const axios = axiosInstance();

const Page = ({ disabledVariant = true, setLoadingButton, loadingButton, cart, state, getCart }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const { isAuthenticated, user } = useSelector(({ login }) => login || {});

  const userInfo = user
    ? {
        user_name: user.name || "",
        user_phone: `${user.prefix || ""}${user.phone || ""}`,
        user_last_name: user.last_name || "",
        user_email: user.email || "",
      }
    : {};

  const dataLayerContent = {
    event: "add_to_cart",
    user_info: userInfo,
    ecommerce: {
      currency: "INR",
      value: state?.price,
      items: [
        {
          item_name: state?.title,
          item_id: state?.sku,
          price: state?.price,
          brand: "SATLAA Jewellery",
          quantity: 1,
        },
      ],
    },
  };

  const addCart = async (res) => {
    setIsLoading(true);
    setLoadingButton(true);

    try {
      TagManager.dataLayer({ dataLayer: null });
      TagManager.dataLayer({ dataLayer: dataLayerContent });

      const productsDataArray = cart?.products || [];
      const productsData = [];

      if (state?.type) {
        const variantControl = productsDataArray.find(
          (x) =>
            (x.product_id._id == state._id || x.product_id == state._id) &&
            JSON.stringify(x.selectedVariants) == JSON.stringify(res)
        );

        if (!variantControl) {
          productsData.push(...productsDataArray, {
            product_id: state._id,
            selectedVariants: res,
            seo: state.seo,
            qty: 1,
            price: state.price,
            sku: state.sku,
          });
        } else {
          productsData.push(
            ...productsDataArray.filter(
              (x) => JSON.stringify(x.selectedVariants) !== JSON.stringify(res)
            ),
            {
              product_id: state._id,
              selectedVariants: res,
              seo: state.seo,
              qty: variantControl.qty + 1,
              price: state.price,
              sku: state.sku,
            }
          );
        }
      } else {
        const variantControlId = productsDataArray.find(
          (x) => x.product_id._id == state._id || x.product_id == state._id
        );

        if (!variantControlId) {
          productsData.push(...productsDataArray, {
            product_id: state._id,
            selectedVariants: undefined,
            seo: state.seo,
            qty: 1,
            price: state.price,
            sku: state.sku,
          });
        } else {
          productsData.push(
            ...productsDataArray.filter((x) => x.product_id !== state._id),
            {
              product_id: state._id,
              selectedVariants: undefined,
              seo: state.seo,
              qty: variantControlId.qty + 1,
              price: state.price,
              sku: state.sku,
            }
          );
        }
      }

      const post = { products: productsData };

      if (isAuthenticated) {
        post.created_user = { name: user.name, id: user.id };
        post.customer_id = user.id;

        const response = await axios.post(`${API_URL}/cart/${cart?._id}`, post);

        getCart(user.id);
        reset();
        toast({ title: "Success", description: "Product Added!", variant: "success" });
      } else {
        dispatch(cartFetch(post));
        toast({ title: "Success", description: "Product Added!", variant: "success" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Some Error, Please Try Again", variant: "destructive" });
      console.error("Add to cart error:", error);
    } finally {
      setIsLoading(false);
      setLoadingButton(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row z-40 gap-y-2 md:gap-x-2 bg-white">
      <Loader loading={isLoading} />
      <div className="flex md:relative gap-x-2 fixed bottom-0 font-bold py-1 px-1 left-0 z-40 w-full bg-white">
        <form
          className="w-full"
          onSubmit={handleSubmit((res) => {
            if (!loadingButton) return;
            addCart(res);
          })}
        >
          <Button
            className="w-full shadow-md bg-[#e76e81] text-white border transition duration-200 border-transparent hover:text-primary hover:bg-white hover:border-secondary hover:border capitalize"
            disabled={!disabledVariant || isLoading}
            type="submit"
          >
            {isLoading ? "Adding..." : "ADD TO CART"}
          </Button>
        </form>

        <form
          className="w-full"
          onSubmit={handleSubmit((res) => {
            if (!loadingButton) return;
            addCart(res);
            router.push("/cart");
          })}
        >
          <Button
            className="w-full shadow-md bg-[#e76e81] text-white border border-transparent transition duration-200 hover:bg-white hover:text-black"
            disabled={!disabledVariant || isLoading}
            type="submit"
          >
            {isLoading ? "Processing..." : "BUY NOW"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;