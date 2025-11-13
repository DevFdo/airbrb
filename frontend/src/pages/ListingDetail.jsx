

const ListingDetail = () => {
  const { listingId } = useParams();

  const location = useLocation();
  const rawStart = location.state?.startDate;
  const rawEnd = location.state?.endDate;

  const startDate = rawStart ? dayjs(rawStart) : null;
  const endDate = rawEnd ? dayjs(rawEnd) : null;
}