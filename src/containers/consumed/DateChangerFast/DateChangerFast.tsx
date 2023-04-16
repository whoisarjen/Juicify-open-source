import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";

const DateChangerFast = () => {
    const router: any = useRouter();

    return (
        <div className="flex w-full items-center gap-3 text-center">
            <Link
                className="flex h-12 w-12 items-center justify-center rounded bg-gray-100"
                href={`/${router.query.login}/consumed/${moment(router.query.date)
                    .add(-2, "days")
                    .format("YYYY-MM-DD")}`}
            >
                {moment(router.query.date).add(-2, "days").format("DD")}
            </Link>
            <Link
                className="flex h-12 w-12 items-center justify-center rounded bg-gray-100"
                href={`/${router.query.login}/consumed/${moment(router.query.date)
                    .add(-1, "days")
                    .format("YYYY-MM-DD")}`}
            >
                {moment(router.query.date).add(-1, "days").format("DD")}
            </Link>
            <div className="flex h-16 flex-1 items-center justify-center rounded bg-blue-300 text-white">
                {moment(router.query.date).format("DD.MM.YYYY")}
            </div>
            <Link
                className="flex h-12 w-12 items-center justify-center rounded bg-gray-100"
                href={`/${router.query.login}/consumed/${moment(router.query.date)
                    .add(1, "days")
                    .format("YYYY-MM-DD")}`}
            >
                {moment(router.query.date).add(1, "days").format("DD")}
            </Link>
            <Link
                className="flex h-12 w-12 items-center justify-center rounded bg-gray-100"
                href={`/${router.query.login}/consumed/${moment(router.query.date)
                    .add(2, "days")
                    .format("YYYY-MM-DD")}`}
            >
                {moment(router.query.date).add(2, "days").format("DD")}
            </Link>
        </div>
    );
};

export default DateChangerFast;
