function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    loading
}) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                <h2 className="text-2xl font-bold text-slate-800">
                    Delete Bug
                </h2>

                <p className="mt-4 text-slate-600">
                    Are you sure you want to delete this bug?
                </p>

                <p className="mt-2 text-red-600 font-medium">
                    This action cannot be undone.
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-lg border px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default DeleteConfirmationModal;