import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import { useGetAllSessions, useDeleteSession } from "../../hooks/useSessions";
import type { Session } from "../../types/session";
import Loader from "../../components/Loader/Loader";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<{
    open: boolean;
    data: Session | null;
  }>({
    open: false,
    data: null,
  });

  const { data: sessions = [], isLoading } = useGetAllSessions();
  const deleteSessionMutation = useDeleteSession();

  const handleDeleteSession = async () => {
    if (openDeleteAlert.data?._id) {
      try {
        await deleteSessionMutation.mutateAsync(openDeleteAlert.data._id);
        setOpenDeleteAlert({ open: false, data: null });
      } catch {
        // Error handling is done in the hook
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
          {sessions.map((session, index) => (
            <SummaryCard
              key={session._id}
              colors={CARD_BG[index % CARD_BG.length]}
              role={session.role}
              topicsToFocus={session.topicsToFocus}
              experience={session.experience}
              questions={
                Array.isArray(session.questions)
                  ? session.questions.length
                  : session.questions || "-"
              }
              description={session.description}
              lastUpdated={session.updatedAt}
              onSelect={() => navigate(`/interview-prep/${session._id}`)}
              onDelete={() => setOpenDeleteAlert({ open: true, data: session })}
            />
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">
              No sessions yet. Create your first one!
            </p>
          </div>
        )}

        <button
          onClick={() => setOpenCreateModal(true)}
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#FF9324] to-[#E99A4B] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
        >
          <LuPlus className="text-2xl text-white" /> Add New
        </button>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <CreateSessionForm
          onClose={() => {
            setOpenCreateModal(false);
            console.log("close modal");
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Session"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the session "
            {openDeleteAlert.data?.role}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setOpenDeleteAlert({ open: false, data: null })}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={deleteSessionMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSession}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleteSessionMutation.isPending}
            >
              {deleteSessionMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
