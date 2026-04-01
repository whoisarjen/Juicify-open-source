import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";

const DateChangerFast = () => {
    const router: any = useRouter();

    const offsets = [-2, -1, 0, 1, 2]

    return (
        <div className="flex w-full items-center gap-2 text-center">
            {offsets.map((offset) => {
                const date = moment(router.query.date).add(offset, "days")
                const isToday = offset === 0

                return isToday ? (
                    <div
                        key={offset}
                        className="flex h-[42px] flex-1 items-center justify-center rounded-xl bg-[rgba(144,202,249,0.10)] border border-[rgba(144,202,249,0.20)] text-sm font-bold text-primary-dark"
                    >
                        {date.format("DD.MM.YYYY")}
                    </div>
                ) : (
                    <Link
                        key={offset}
                        className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-glass-border bg-glass text-sm font-bold text-[#9ca3af] transition-all duration-300 hover:border-glass-border-hover hover:bg-glass-hover"
                        href={`/${router.query.login}/consumed/${date.format("YYYY-MM-DD")}`}
                    >
                        {date.format("DD")}
                    </Link>
                )
            })}
        </div>
    );
};

export default DateChangerFast;
