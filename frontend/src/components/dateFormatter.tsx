import { parseISO, format } from 'date-fns';

type Props = {
  dateString: string;
};

export default function DateFormatter({ dateString }: Props) {
  try {
    const date = parseISO(dateString);
    return (
      <time
        dateTime={dateString}
        className="m-2 italic font-light text-gray-500"
      >
        {format(date, 'LLLL	d, yyyy')}
      </time>
    );
  } catch (e) {
    return <></>;
  }
}
