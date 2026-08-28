import useAPICall, { APIPages } from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";

const useDeleteOne = () => {
  const apiCall = useAPICall();
  const { toast } = useToast();

  return async ({
    id,
    setState,
    page,
  }: {
    id: string;
    setState: any;
    page: APIPages;
  }) => {
    const response = await apiCall({
      method: "DELETE",
      page,
      itemId: id,
    });

    if (!response.success) {
      toast.error(response.message || "Something went wrong");
      return;
    }

    setState((prev: any) =>
      prev.filter((item: any) => {
        const itemId = item.id || item._id;
        return itemId !== id;
      }),
    );
  };
};

export default useDeleteOne;
