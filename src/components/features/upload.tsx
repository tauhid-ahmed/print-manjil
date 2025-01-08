import React from "react";
import Image from "next/image";

interface UploadProps {
  rootObjectUrl: (url: string) => void;
}

interface ImageComponentProps {
  image: string;
}

export default function Upload({ rootObjectUrl }: UploadProps) {
  const [objectUrl, setObjectUrl] = React.useState<string>("");

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];
      const objectUrl = URL.createObjectURL(imageFile);
      setObjectUrl(objectUrl);
      rootObjectUrl(objectUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-60 aspect-video border rounded relative">
        <div className="absolute -z-0 inset-0 flex items-center justify-center">
          upload a logo
        </div>
        {objectUrl && <ImageComponent image={objectUrl} />}
      </div>
      <div className="flex items-center justify-center space-x-4">
        {/* Button-like Label */}
        <label
          htmlFor="file-upload"
          className="px-6 py-1.5 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer transition"
        >
          Choose File
        </label>

        {/* File Name Display */}
        <span className="text-sm text-gray-500">
          {/* {selectedFile ? selectedFile.name : "No file selected"} */}
        </span>

        {/* Hidden File Input */}
        <input
          id="file-upload"
          // ref={fileInputRef}
          onChange={handleFileInput}
          type="file"
          className="hidden"
        />
        <input type="submit" value="Submit" />
      </div>
    </div>
  );
}

function ImageComponent({ image }: ImageComponentProps) {
  const id = React.useId();

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("id", id);
  };

  return (
    <div className="aspect-video border rounded overflow-hidden active:cursor-move relative">
      <div
        id={id}
        draggable
        onDragStart={handleDrag}
        className="w-full h-full "
      >
        <Image
          width="200"
          height="200"
          src={image}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
