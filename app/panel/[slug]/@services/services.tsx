"use client";

import { useServices_10cd39 } from "@/hooks/services/10cd39";
import Services_10cd39_read from "@/components/services/10cd39_read";
import Services_10cd39_create from "@/components/services/10cd39_create";
import Services_10cd39_update from "@/components/services/10cd39_update";
import Services_10cd39_delete from "@/components/services/10cd39_delete";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";

export default function () {
  const {
    get_services_list_list,
    create_services_data,
    update_services_data,
    delete_services_data,
    services_list,
  } = useServices_10cd39();
  const [servicesModal, servicesModalHandler] = useState(true);

  useEffect(() => {
    // get from server here
    get_services_list_list();
  }, []);

  return (
    <section>
      <button
        onClick={() => servicesModalHandler(true)}
        id="open-modal"
        className="btn btn-primary"
      >
        None
      </button>
      <Modal isOpen={servicesModal} onClose={() => servicesModalHandler(false)}>
        {services_list.map((d, i) => (
          <Services_10cd39_read data={d} key={i} />
        ))}
        <form action={create_services_data}>
          <Services_10cd39_create />
          <button type="submit">None</button>
        </form>
        <form action={None}>
          <Services_10cd39_update />
        </form>
      </Modal>
    </section>
  );
}
