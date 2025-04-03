"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BiSolidStar } from "react-icons/bi";
import { GoCheckCircleFill } from "react-icons/go";
import { API_URL } from "../../../config";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const Reviews = ({ reviews }) => {
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const reviewsPerPage = 10;

  useEffect(() => {
    setDisplayedReviews(reviews.slice(0, reviewsPerPage));
  }, [reviews]);

  const loadMoreReviews = () => {
    const currentLength = displayedReviews.length;
    const newReviews = reviews.slice(currentLength, currentLength + reviewsPerPage);
    setDisplayedReviews([...displayedReviews, ...newReviews]);
    if (currentLength + reviewsPerPage >= reviews.length) {
      setShowMore(false);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedReviews.map((review, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition">
                {review.media?.length > 0 && (
                  <div className="w-full h-[250px] relative">
                    <Image
                      src={review.media[0].url ? `${API_URL + review.media[0].url}` : "/images/nofoto.jpg"}
                      alt="Review Image"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {review.name.length > 11 ? `${review.name.slice(0, 11)}...` : review.name}
                    </h3>
                    {review.verified && <GoCheckCircleFill className="text-green-500" />}
                  </div>
                  <div className="flex my-1">
                    {[...Array(5)].map((_, i) => (
                      <BiSolidStar
                        key={i}
                        className={cn("w-5 h-5", i < review.rating ? "text-yellow-500" : "text-gray-300")}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.reviewText.length > 100 ? `${review.reviewText.slice(0, 100)}...` : review.reviewText}
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <div className="flex items-center gap-2 text-lg font-semibold">
                {review.name} {review.verified && <GoCheckCircleFill className="text-green-500" />}
                {review.verified && <span className="text-sm text-gray-500">Verified Purchase</span>}
              </div>
              <div className="flex my-2">
                {[...Array(5)].map((_, i) => (
                  <BiSolidStar
                    key={i}
                    className={cn("w-5 h-5", i < review.rating ? "text-yellow-500" : "text-gray-300")}
                  />
                ))}
              </div>
              {review.media?.length > 0 && (
                <div className="space-y-2">
                  {review.media.map((image, i) => (
                    <Image
                      key={i}
                      src={image.url ? `${API_URL + image.url}` : "/images/nofoto.jpg"}
                      alt="Review Image"
                      width={500}
                      height={400}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
              <p className="text-gray-700">{review.reviewText}</p>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {showMore && (
        <Button variant="outline" className="mt-4 w-full" onClick={loadMoreReviews}>
          Load More Reviews
        </Button>
      )}
    </div>
  );
};

export default Reviews;