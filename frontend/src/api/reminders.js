import axios from 'axios'
import { useMutation, useQuery } from 'react-query'
import errorHandler from './utils/errorHandler'
import validateCreateReminderData from './utils/validation'

const axiosInstance = axios.create({
	baseURL:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:5621/api/v1'
			: 'https://reminders.zuri.chat/api/v1',
})

export const useAllReminders = () => {
	const {
		isLoading,
		isSearchActive,
		foundReminders,
		data,
		error,
		isPlaceholderData,
		isError,
		status,
	} = useQuery(
		'allReminders',
		async () => {
			try {
				const res = await axiosInstance({
					method: 'GET',
					url: '/deadlines',
				})
				return res.data.data
			} catch (error) {
				throw errorHandler(error)
			}
		},
		{
			placeholderData: () => {
				return {
					data: {
						result: [],
					},
				}
			},
		}
	)

	const currentReminders = isSearchActive ? foundReminders : data

	// fetchedData is the response returned from the get query, error only exists if there's an error
	// isLoading and isPlaceholderData are Booleans representing loading and palceholder data states respectively
	// isPlaceholder exists primarily to deal with react calling methods on undefined when mounting components

	return {
		fetchedData: currentReminders,
		isLoading,
		error,
		isPlaceholderData,
		isError,
		status,
	}
}

export const useCreateReminder = (payload) => {
	const { data, error, isLoading, isSuccess } = useMutation(
		'createReminder',
		async () => {
			if (validateCreateReminderData(payload)) {
				try {
					const res = await axiosInstance({
						data: payload,
						method: 'POST',
						url: '/reminders',
					})

					return res
				} catch (error) {
					throw errorHandler(error)
				}
			}
		}
	)

	// Data is the response returned from the post, error only exists if there's an error
	// isLoading and isSuccess are Booleans representing loading and success states respectively
	// You can use isLoading to show loading spinners and isSuccess to tell when the request completed successfully and inform the user
	return { responseBody: data, error, isLoading, isSuccess }
}
