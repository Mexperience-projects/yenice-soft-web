import { useClients } from "@/hooks/clients/main";
import { AlertCircle, Edit, Plus, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import Visit_ae978b_create from "@/components/visit/ae978b_create";
import { ClientType, OperationType, VisitType } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useVisits } from "@/hooks/visit/ae978b";
import { useTranslation } from "react-i18next";
import CreateClient from "../../@clients/(modals)/createClient";
import { useServices_10cd39 } from "@/hooks/services/10cd39";
import { useItems_691d50 } from "@/hooks/items/691d50";

interface VisitFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVisit?: VisitType;
}

export default function VisitForm({
  isOpen,
  onClose: onClose_,
  selectedVisit,
}: VisitFormProps) {
  const { t } = useTranslation();
  const { create_clients_data, clients_list, get_clients_list_list } =
    useClients();
  const { create_visit_data } = useVisits();
  const { get_items_list_list } = useItems_691d50();
  const { get_services_list_list } = useServices_10cd39();
  const [isClientCreateModalOpen, setIsClientCreateModalOpen] = useState(false);
  const [editMode, editModeHandler] = useState(false);
  const [openDeleteModal, openDeleteModalHandler] = useState(false);

  const emptyForm = {
    client: undefined as ClientType | undefined,
    operations: [
      {
        id: 1,
        datetime: new Date(Date.now()),
        items: [],
        payments: [],
        service: [],
      },
    ] as OperationType[],
  };

  const [formData, setFormData] = useState(emptyForm);
  const [menu, menuHandler] = useState<OperationType>(formData.operations[0]);

  useEffect(() => {
    if (selectedVisit) {
      setFormData(selectedVisit);
      menuHandler(selectedVisit.operations[0]);
    } else {
      setFormData(emptyForm);
      menuHandler(emptyForm.operations[0]);
    }
  }, [selectedVisit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onClose = () => {
    setFormData(emptyForm);
    onClose_();
  };

  useEffect(() => {
    get_clients_list_list();
    get_services_list_list();
    get_items_list_list();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-row bg-gray-100">
          {/* Menu bar */}
          <div className="w-64">
            <ul className="space-y-2 flex flex-col p-5 pr-0 ">
              {/* Menu header */}
              <div className="form-control">
                <div className="relative group">
                  <User className="h-6 w-6 text-primary absolute left-5 top-3" />
                  <input
                    id="client"
                    type="char"
                    value={formData.client?.name}
                    onChange={handleChange}
                    placeholder={t("visits.enterClientName")}
                    className="input input-bordered w-full bg-gray-50 border-gray-200
                        focus:border-primary focus:ring-primary pl-14"
                    required
                  />
                  <div className="absolute z-30 bg-white shadow-lg rounded-lg w-full hidden group-hover:flex hover:flex flex-col border border-gray-100">
                    <div className="max-h-60 overflow-y-auto flex flex-col">
                      {clients_list.map((client) => (
                        <div
                          key={client.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setFormData((prev: any) => ({
                              ...prev,
                              client: client,
                            }));
                          }}
                        >
                          {client.name}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 w-full p-2">
                      <button
                        type="button"
                        className="btn bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-0 text-secondary btn-sm w-full flex items-center justify-center gap-2"
                        onClick={() => setIsClientCreateModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />{" "}
                        {t("visits.createNewClient")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              {formData.operations.map((item, i) => (
                <button
                  onClick={() => menuHandler(item)}
                  key={i}
                  className="btn bg-white disabled:bg-gradient-to-r 
                    from-primary to-secondary shadow disabled:text-white"
                  disabled={item.id === menu?.id}
                >
                  {new Date(item.datetime).toLocaleDateString()} ({i + 1})
                </button>
              ))}

              {/* add Visit */}
              {editMode && (
                <button
                  onClick={() => {
                    const newOperation: OperationType = {
                      id: formData.operations.length + 1,
                      datetime: new Date(Date.now()),
                      items: [],
                      payments: [],
                      service: [],
                    };
                    setFormData((f) => ({
                      ...f,
                      operations: [...f.operations, newOperation],
                    }));
                    menuHandler(newOperation);
                  }}
                  className="text-blue-500 border-dashed border-2 flex border-blue-200
                flex-row items-center justify-center rounded-xl p-3 space-x-3"
                >
                  <Plus />
                  <p className="">{t("visits.addVisit")}</p>
                </button>
              )}
            </ul>
          </div>

          {/* Menu Body */}
          <div className="p-6 flex flex-col min-w-[600px] md:min-w-[800px] xl:min-w-[1000px]">
            <div className="flex flex-row justify-between items-center space-y-2  mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex">
                <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
                {t("visits.operation")}{" "}
                {new Date(menu?.datetime).toLocaleDateString()}
              </h2>
              <div className="flex flex-rowitems-center justify-center space-x-2">
                <button
                  onClick={() => editModeHandler((e) => !e)}
                  className={cn(
                    "px-3 py-1.5 text-secondary hover:bg-secondary/20",
                    "rounded-lg transition-colors flex items-center gap-1",
                    {
                      "bg-secondary/10": editMode,
                    }
                  )}
                >
                  <Edit className="h-3.5 w-3.5" />
                  {t("common.edit")}
                </button>
                <button
                  disabled={formData.operations.length === 1}
                  onClick={() => openDeleteModalHandler(true)}
                  className="px-3 py-1.5 text-red-500 disabled:text-gray-500 enabled:hover:bg-red-100
                  rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("common.delete")}
                </button>
              </div>
            </div>

            <Visit_ae978b_create
              readonly={!editMode}
              initial={menu}
              setFormData={(newFormData) =>
                setFormData((f) => ({
                  ...f,
                  operations: f.operations.map((o) =>
                    o.id === menu.id ? newFormData : o
                  ),
                }))
              }
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                onClick={onClose}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => {
                  create_visit_data(formData);
                }}
                className="px-4 py-2 text-sm font-medium text-white enabled:bg-gradient-to-r from-primary disabled:bg-gray-400
                to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 group relative"
                disabled={formData.client === undefined}
              >
                {t("visits.saveData")}
                <p className="absolute text-red-700 bg-white/80 rounded-xl w-40 p-2 right-5 top-0 group-disabled:group-hover:flex hidden">
                  please select client first
                </p>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Visit Modal */}
      <Modal
        isOpen={openDeleteModal}
        onClose={() => {
          openDeleteModalHandler(false);
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">
            {t("visits.deleteVisit")}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {t("visits.deleteVisitConfirm")}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              onClick={() => {
                openDeleteModalHandler(false);
              }}
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={() => {
                setFormData((f) => ({
                  ...f,
                  operations: f.operations.filter((o) => o.id != menu.id),
                }));
                openDeleteModalHandler(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300"
            >
              {t("common.delete")}
            </button>
          </div>
        </div>
      </Modal>

      {/* create client modal */}
      <CreateClient
        onClose={() => setIsClientCreateModalOpen(false)}
        isOpen={isClientCreateModalOpen}
        onSubmit={async (form_) => {
          const client = (await create_clients_data(form_)) as ClientType;
          setFormData((f) => ({ ...f, client }));
          setIsClientCreateModalOpen(false);
        }}
      />
    </>
  );
}
