import ClientForm from "@/components/client/client-form";

interface CreateClientModal {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form_: FormData) => void;
}

export default function ({ isOpen, onClose, onSubmit }: CreateClientModal) {
  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl bg-white rounded-xl shadow-lg">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-gray-800 flex items-center">
          <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
          Add New Client
        </h3>
        <p className="py-2 text-gray-600">
          Enter the client's information below to create a new record.
        </p>

        <form action={onSubmit} className="mt-4">
          <ClientForm />
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
            >
              Create Client
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
