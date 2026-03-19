import { CheckIcon, XIcon } from "lucide-react";
import { SubmitButton } from "./buttons/SubmitButton";
import { Avatar } from "./Avatar";
import { FriendRequest } from "@/types/api/user";
import { useActionState, useState } from "react";
import { acceptFriendRequest, rejectFriendRequest } from "@/app/friend/action";

export const RequestItem = ({ request }: { request: FriendRequest }) => {
  const requestSender = request.sender;

  return (
    <li className="flex cursor-pointer items-center justify-between gap-5 rounded-sm p-2 hover:bg-gray-50">
      <div className="flex items-center gap-5">
        <Avatar size="small" user={requestSender} />
        <div>{requestSender.name}</div>
      </div>
      <RequestItemButton
        requestId={request?.id.toString() ?? ""}
        requestSenderId={requestSender?.id.toString() ?? ""}
      />
    </li>
  );
};

const initialState = {
  message: "",
  error: "",
  ok: false,
  data: {},
};

export const RequestItemButton = ({
  requestId,
  requestSenderId,
}: {
  requestId: string;
  requestSenderId: string;
}) => {
  const [acceptState, acceptAction] = useActionState(
    acceptFriendRequest,
    initialState,
  );
  const [rejectState, rejectAction] = useActionState(
    rejectFriendRequest,
    initialState,
  );
  const [loading, setLoading] = useState(false);

  const isAccepted = acceptState.ok;
  const isRejected = rejectState.ok;

  if (isAccepted) {
    return <div className="text-xs text-green-500">Accepted</div>;
  }
  if (isRejected) {
    return <div className="text-xs text-red-500">Rejected</div>;
  }
  return (
    <div className="flex items-center gap-2">
      {/* accept request form */}
      <form action={acceptAction} onSubmit={() => setLoading(true)}>
        <input
          type="hidden"
          name="request_id"
          id="request_id"
          value={requestId}
        />
        <input
          type="hidden"
          name="requestSenderId"
          id="requestSenderId"
          value={requestSenderId.toString()}
        />
        <SubmitButton
          className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300"
          disabled={loading}
        >
          <CheckIcon />
        </SubmitButton>
        {acceptState.message && (
          <div className="text-xs text-gray-500">{acceptState.message}</div>
        )}
        {acceptState.error && (
          <div className="text-xs text-red-500">{acceptState.error}</div>
        )}
        {acceptState.ok && (
          <div className="text-xs text-green-500">{acceptState.message}</div>
        )}
      </form>
      {/* reject request form */}
      <form action={rejectAction} onSubmit={() => setLoading(true)}>
        <input
          type="hidden"
          name="request_id"
          id="request_id"
          value={requestId}
        />
        <SubmitButton
          className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300"
          disabled={loading}
        >
          <XIcon />
        </SubmitButton>
      </form>
    </div>
  );
};
