import useAPICall, { APIPages } from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";
import { useApp } from "@/providers/app-context";

const useDeleteOne = () => {
  const apiCall = useAPICall();
  const { toast } = useToast();
  const { deleteOneBusy, setDeleteOneBusy } = useApp();

  return async ({
    id,
    setState,
    page,
  }: {
    id: string;
    setState: any;
    page: APIPages;
  }) => {
    setDeleteOneBusy(true);

    const response = await apiCall({
      method: "DELETE",
      page,
      itemId: id,
    });

    setDeleteOneBusy(false);

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
