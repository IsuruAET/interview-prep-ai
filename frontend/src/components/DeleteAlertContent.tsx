const DeleteAlertContent = ({
  content,
  onDelete,
}: {
  content: string;
  onDelete: () => void;
}) => {
  return (
    <div className="p-5">
      <p className="text-[14px]">{content}</p>

      <div className="flex justify-end mt-6">
        <button type="button" onClick={onDelete} className="btn-small">
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
