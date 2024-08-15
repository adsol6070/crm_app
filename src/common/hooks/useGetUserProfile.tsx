import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { userService } from "../../api/user"

interface User {
	id: string
	tenantID: string
	firstname: string
	lastname: string
	email: string
	phone: string
	city: string
	address: string
	profileImage: string | null
	isEmailVerified: boolean
	role: string
	online: boolean
	imageUrl: string
}

const getProfile = (): [User | null, boolean] =>{
    const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const { user: authUser } = useAuth()

	useEffect(() => {
		const fetchLoggedInUser = async () => {
			try {
				const userId = {
					userId: user.sub,
				}
				const currentLoggedInUser = await userService.getProfile(userId)
				setCurrentUser(currentLoggedInUser)
			} catch (error) {
				console.error('Error fetching logged in user:', error)
			} finally{
				setLoading(false)
			}
		}

		if (authUser) {
			fetchLoggedInUser()
		}
	}, [])

	return [currentUser, loading]

}

export default getProfile