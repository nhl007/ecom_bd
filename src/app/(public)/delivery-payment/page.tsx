import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const page = () => {
  return (
    <MaxWidthWrapper className=" mt-6 mb-10">
      <h1 className=" text-3xl md:text-4xl font-semibold mb-2">
        Delivery & Payment
      </h1>
      <div className=" flex flex-col md:flex-row border-[1px] my-4">
        <div className=" flex-1 border-r-[1px] p-6">
          <h1 className=" text-2xl md:text-3xl text-red-600 font-semibold mb-2">
            আপনি ঢাকা সিটির ভিতরে হলেঃ-
          </h1>
          <p className="  md:text-lg font-medium">
            ক্যাশ অন ডেলিভারি/হ্যান্ড টু হ্যান্ড ডেলিভারি।
            <br />
            <br />
            ডেলিভারি চার্জ 50 টাকা।
            <br />
            <br />
            পণ্যের টাকা ডেলিভারি ম্যানের কাছে প্রদান করবেন।
            <br />
            <br />
            অর্ডার কনফার্ম করার ৪৮ ঘণ্টার ভিতর ডেলিভারি পাবেন।
            <br />
            <br />
            বিঃদ্রঃ- ছবি এবং বর্ণনার সাথে পণ্যের মিল থাকা সত্যেও আপনি পণ্য গ্রহন
            করতে না চাইলে ডেলিভারি চার্জ ৬০ টাকা
          </p>
        </div>
        <div className=" flex-1 border-l-[1px] p-6">
          <h1 className=" text-2xl md:text-3xl text-blue-600 font-semibold mb-2">
            আপনি ঢাকা সিটির বাহিরে হলেঃ-
          </h1>
          <p className=" md:text-lg font-medium">
            কন্ডিশন বুকিং অ্ল কুরিয়ার সার্ভিস (এস এ পরিবহন,সুন্দরবান অথবা জননী
            কুরিয়ার সার্ভিস) এ নিতে হবে।
            <br />
            <br />
            অথবা ক্যাশ অন ডেলিভারি
            <br />
            <br />
            রেডেক্স,ই-কুরিয়ার ,ও পাটাও,ডেলিভারী টাইগার এর মাধ্যমে হোম ডেলিভার
            দেওয়া যাবে
            <br />
            <br />
            <span className=" text-red-500">
              কুরিয়ার সার্ভিস চার্জ 100 টাকা
            </span>
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
