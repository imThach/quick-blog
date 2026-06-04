import { useAuth } from '../../components/context/authContext';

export default function useAuthorization() {
    const { user } = useAuth();

    // Lấy thông tin user an toàn (đề phòng dữ liệu bị lồng)
    let currentUser = user?.user || user?.data || user;

    // Tự động giải mã token nếu Context bị thiếu thông tin
    if (currentUser?.accessToken && !currentUser?.id && !currentUser?._id) {
        try {
            const payload = JSON.parse(atob(currentUser.accessToken.split('.')[1]));
            currentUser = { ...currentUser, ...payload };
        } catch (e) { }
    }

    const userId = currentUser?.id || currentUser?._id || currentUser?.userId || currentUser?.sub;
    const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

    const isOwner = (authorId) => {
        if (!userId || !authorId) return false;
        return String(authorId) === String(userId);
    };

    const canModify = (authorId) => {
        return isAdmin || isOwner(authorId);
    };

    return { isAdmin, isOwner, canModify, userId };
}