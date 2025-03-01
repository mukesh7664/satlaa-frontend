import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardActionArea, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { IMG_URL } from "../../../config";
import Image from "next/image";

const Default = () => {
  const { categories } = useSelector((state) => state.categories) || {};
  const [categoriesData, setCategoriesData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      setCategoriesData(categories);
    }
  }, [categories]);

  const onClickCard = (seo) => {
    if (seo) router.push(`/${seo}`);
  };

  return (
    <Grid container spacing={3}>
      {categoriesData.length > 0 ? (
        categoriesData.map((val) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={val.seo}>
            <Card className="m-4 shadow-lg" onClick={() => onClickCard(val.seo)}>
              <CardActionArea>
                <Image
                  alt={val.title || "Default Title"}
                  width={300}
                  height={200}
                  src={val.image ? `${IMG_URL}${val.image}` : "/images/default.jpg"}
                  priority
                />
                <CardContent>
                  <Typography variant="h6" className="uppercase">
                    {val.title || "Unnamed Category"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6" align="center" className="text-center">
            No categories available
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default Default;