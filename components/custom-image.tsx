"use client";

import { IKImageProps, Image } from "@imagekit/next";

import { env } from "@/env";

export const CustomImage = (props: IKImageProps) => {
  // const [showPlaceholder, setShowPlaceholder] = useState(true);
  return (
    <div style={{ position: "relative" }}>
      <Image
        urlEndpoint={env.NEXT_PUBLIC_IMAGEKIT_URL}
        {...props}
        // style={showPlaceholder ? {
        //     backgroundImage: `url(${buildSrc({
        //         urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL,
        //         src: props.src,
        //         transformation: [
        //             {
        //                 quality: 10,
        //                 blur: 90,
        //             }
        //         ]
        //     })})`,
        //     backgroundSize: "cover",
        //     backgroundRepeat: "no-repeat",
        // } : {}}
        //     onLoad={() => {
        //         setShowPlaceholder(false);
        //     }}
      />
    </div>
  );
};
