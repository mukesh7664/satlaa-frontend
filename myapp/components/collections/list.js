import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { IMG_URL } from "../../../config";
import Image from "next/image";

const Default = () => {
  const { collections } = useSelector(({ collections }) => collections);
  const [collectionsData, setCollectionsData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (collections) setCollectionsData(collections);
  }, [collections]);

  const onClickCard = (seo) => {
    router.push(`/collections/${seo}`);
  };

  return (
    <Grid container spacing={3}>
      {collectionsData?.length > 0 ? (
        collectionsData.map((val) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={val.seo}>
            <Card className="m-4 shadow-lg">
              <CardActionArea onClick={() => onClickCard(val.seo)}>
                <div className="relative w-full h-48">
                  <Image
                    alt={val.title || "Default Title"}
                    src={val.image ? `${IMG_URL}${val.image}` : "/images/default.jpg"}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardContent className="uppercase text-center">
                  <Typography variant="h6" component="h2">
                    {val.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="body1" className="m-4">
          No collections available.
        </Typography>
      )}
    </Grid>
  );
};

export default Default;