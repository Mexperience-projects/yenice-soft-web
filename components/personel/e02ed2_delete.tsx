"use client";

interface PersonnelDeleteProps {
  id: string;
  onDelete: (confirm: boolean) => void;
}

export default function Personel_e02ed2_delete({
  id,
  onDelete,
}: PersonnelDeleteProps) {
  return (
    <div className="space-y-4">
      <div className="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Warning!</h3>
          <div className="text-sm">
            Are you sure you want to delete this personnel record? This action
            cannot be undone.
          </div>
        </div>
      </div>

      <div className="modal-action">
        <button type="button" className="btn" onClick={() => onDelete(false)}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-error"
          onClick={() => onDelete(true)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
