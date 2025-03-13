"use client";

import { useState, useEffect } from "react";
import { useuser } from "@/hooks/user/e02ed2";
import { useTranslation } from "react-i18next";
import { USER_PERMISSIONS, type UsersType } from "@/lib/types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: UsersType | undefined;
}

export default function UserModal({
  isOpen,
  onClose,
  selectedUser,
}: UserModalProps) {
  const { t } = useTranslation();
  const { create_user_data, loading: isLoading } = useuser();

  // State to track selected permissions
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Initialize permissions when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setSelectedPermissions(selectedUser.permissions || []);
    } else {
      setSelectedPermissions([]);
    }
  }, [selectedUser]);

  // Handle permission checkbox changes
  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions((prev) => [...prev, permission]);
    } else {
      setSelectedPermissions((prev) => prev.filter((p) => p !== permission));
    }
  };

  if (!isOpen) return null;

  // If user is selected, show the layout with user data
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl p-0">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {selectedUser?.username || t("user.addNewUser")}
          </h3>
          <div className="flex gap-2">
            <button
              type="submit"
              form="update-user-form"
              disabled={isLoading}
              className="btn btn-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  {t("common.saving")}
                </>
              ) : (
                t("user.saveChanges")
              )}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-ghost text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              onClick={onClose}
            >
              {t("common.close")}
            </button>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="mt-2">
            <h4 className="font-semibold mb-2">{t("user.details")}</h4>
            <form
              id="update-user-form"
              action={(f) => {
                create_user_data(f);
                onClose();
              }}
              className="space-y-3"
            >
              <input type="hidden" name="id" value={selectedUser?.id} />

              <div className="grid grid-cols-1 gap-3">
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text text-gray-700 font-medium">
                      {t("user.username")}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder={t("user.enterUsername")}
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                    defaultValue={selectedUser?.username}
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text text-gray-700 font-medium">
                      {t("user.password")}
                    </span>
                    {selectedUser ? (
                      <span className="label-text-alt text-gray-500">
                        {t("user.leaveBlankToKeepCurrent")}
                      </span>
                    ) : (
                      <></>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={
                      selectedUser ? "••••••••" : t("user.enterPassword")
                    }
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text text-gray-700 font-medium">
                      {t("user.permissions")}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {Object.values(USER_PERMISSIONS).map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={(e) =>
                            handlePermissionChange(permission, e.target.checked)
                          }
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <span className="text-sm">
                          {/* {t(`user.permissionTypes.${permission}`)} */}
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <input
                type="hidden"
                name="permissions"
                value={selectedPermissions}
              />
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </div>
    </div>
  );
}
