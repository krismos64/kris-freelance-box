import React, { useState, useEffect } from 'react'
    import Lottie from 'lottie-react'
    import animationData from './business-management.json'
    import { useSpring, animated } from 'react-spring'
    import {
      BarChart,
      Bar,
      XAxis,
      YAxis,
      CartesianGrid,
      Tooltip,
      ResponsiveContainer,
    } from 'recharts'

    interface Revenue {
      id: string
      date: string
      amount: number
    }

    interface Client {
      id: string
      name: string
      address: string
      postalCode: string
      city: string
      email: string
      phone: string
      creationDate: string
      imageUrl: string
    }

    const Dashboard: React.FC = () => {
      const [revenues, setRevenues] = useState<Revenue[]>([])
      const [clients, setClients] = useState<Client[]>([])

      useEffect(() => {
        // Load revenues from local storage
        const storedRevenues = localStorage.getItem('revenues')
        if (storedRevenues) {
          setRevenues(JSON.parse(storedRevenues))
        }
        // Load clients from local storage
        const storedClients = localStorage.getItem('clients')
        if (storedClients) {
          setClients(JSON.parse(storedClients))
        }
      }, [])

      useEffect(() => {
        // Load revenues from local storage
        const storedRevenues = localStorage.getItem('revenues')
        if (storedRevenues) {
          setRevenues(JSON.parse(storedRevenues))
        }
      }, [revenues])

      useEffect(() => {
        // Load clients from local storage
        const storedClients = localStorage.getItem('clients')
        if (storedClients) {
          setClients(JSON.parse(storedClients))
        }
      }, [clients])

      const totalRevenue = revenues.reduce(
        (acc, revenue) => acc + revenue.amount,
        0,
      )
      const totalClients = clients.length

      const today = new Date()
      const formattedDate = today.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const textAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 280, friction: 60 },
      })

      const currentYear = new Date().getFullYear()
      const monthlyRevenue = Array(12).fill(0)

      revenues
        .filter((revenue) => new Date(revenue.date).getFullYear() === currentYear)
        .forEach((revenue) => {
          const month = new Date(revenue.date).getMonth()
          monthlyRevenue[month] += revenue.amount
        })

      const chartData = monthlyRevenue.map((amount, index) => ({
        month: new Date(currentYear, index).toLocaleString('fr-FR', {
          month: 'short',
        }),
        revenue: amount,
      }))

      return (
        <div className="p-4">
          <div className="flex flex-col items-start">
            <animated.h2
              className="text-2xl font-bold mb-4"
              style={textAnimation}
            >
              Bonjour et bienvenue sur Kris Freelance Box !
            </animated.h2>
            <animated.p className="mb-4" style={textAnimation}>
              Nous sommes le {formattedDate}.
            </animated.p>
            <div className="mb-4">
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: 200, height: 200 }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Chiffre d'affaires</h3>
              <p className="text-3xl font-bold">{totalRevenue} €</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Nombre de clients</h3>
              <p className="text-3xl font-bold">{totalClients}</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Chiffre d'affaires annuel
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    export default Dashboard
