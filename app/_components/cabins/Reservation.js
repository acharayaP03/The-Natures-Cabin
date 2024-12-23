import { DateSelector, ReservationForm } from '@/app/_components/cabins/index.js';
import { auth } from '@/app/_lib/auth';
import { getBookedDatesByCabinId, getSettings } from '@/app/_lib/data-service.js';
import LoginMessage from '../Auth/LoginMesage';

export default async function Reservation({ cabin }) {
	const session = await auth();
	/**
	 * @description fetching all data in parallel rather than sequentially or in water fall
	 *  await Proise.all([getSettings(), getBookedDatesByCabinId(params.cabinId)])
	 *
	 *  this is better than fetching data sequentially, hoverer it is not the best approach for this situation
	 *  since Promise all will always be faster than the slowest promise, lets just say if getSettings() is the slowest which took 10 secs to
	 *  resolve, the user will have to wait for 10 secs before the page is rendered
	 */
	const [settings, bookedDates] = await Promise.all([
		getSettings(),
		getBookedDatesByCabinId(cabin.id),
	]);
	return (
		<div className='grid grid-cols-2 border border-primary-800 min-h-[px] '>
			<DateSelector settings={settings} bookedDates={bookedDates} cabin={cabin} />
			{session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage />}
		</div>
	);
}
