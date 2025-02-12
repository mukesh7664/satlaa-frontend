import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Row, Col } from "@mui/material";
import router from "next/router";
import { IMG_URL } from "../../../config";
import Image from "next/image";

const Default = () => {
  const { categories } = useSelector(({ categories }) => categories);
  const [categoriesData, seTcategoriesData] = useState([]);

  useEffect(() => {
    if (categories) seTcategoriesData(categories);
  }, [categories]);

  const onClickCard = (data) => {
    router.push("/" + data);
  };

  return (
    <>
      <Row gutter={16}>
        {categoriesData?.length > 0
          ? categoriesData.map((val) => (
              <Col xs={12} sm={12} md={8} lg={6} key={val.seo}>
                <Card
                  hoverable
                  className="uppercase m-4 shadow-lg"
                  cover={
                    <Image
                    alt={val.title ? val.title : "Default Title"}
                    width="150"
                    height="150"
                    src={val.image ? `${IMG_URL + val.image}` : "/images/default.jpg"} // Replace '/images/default.jpg' with your default image path
                  />
                  
                  }
                  onClick={() => onClickCard(val.seo)}
                >
                  <Card.Meta title={val.title} />
                </Card>
              </Col>
            ))
          : ""}
      </Row>
    </>
  );
};

export default Default;
