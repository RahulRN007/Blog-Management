import React, { useEffect, useState } from 'react'
import "../../Styles/Admin/Admindashboard.css"
import Sidebar from '../Sidebar'
import axios from 'axios'
import LineChart from '../Linechart'
import BarChart from '../Barchart'
import BarChartlikes from '../Barchartlikes'
import API from "../../config";

function Admindashboard() {
  const [datas, setDatas] = useState([])
  const [active, setActive] = useState([])
  const [topviews, setTopViews] = useState([])
  const [deactivated, setDeactivated] = useState([])

  const deactivatedAccount = async () => {
    try {
      const cat = await axios.get(`${API}/deactivatedaccount`)
      setDeactivated(cat.data.data)
    } catch (error) {
      console.log("DEACTIVATED ACC FRONTEND ISSUE")
    }
  }

  const totalUsers = async () => {
    try {
      const res = await axios.get(`${API}/totalusers`)
      setDatas(res.data.data)
    } catch (error) {
      console.log("totalusers frontend issue")
    }
  }

  const activeUsers = async () => {
    try {
      const res = await axios.get(`${API}/activeusers`)
      setActive(res.data.data)
    } catch (error) {
      console.log("activeusers frontend issue")
    }
  }

  useEffect(() => {
    totalUsers()
    activeUsers()
    deactivatedAccount()
  }, [])

  return (
    <div className="Admindashboard-container">
      <Sidebar />
      <div className='Admindashboard-main'>
        <div className='Admindashboard-sub'>
          <div className="Admindashboard-grid">
            <div className="Admindashboard-card Admindashboard-stat">
              <span>👥</span>
              <h3>Total Users</h3>
              <p>{datas.length}</p>
            </div>

            <div className="Admindashboard-card Admindashboard-stat">
              <span>🧑‍💼</span>
              <h3>Active Customers</h3>
              <p>{active.length}</p>
            </div>

            <div className="Admindashboard-card Admindashboard-stat">
              <span>💰</span>
              <h3>Total Profit</h3>
              <p>$250,000</p>
            </div>

            <div className="Admindashboard-card Admindashboard-chart Admindashboard-wide Admindashboard-merged">
              <div className="Admindashboard-merged-header">
                <h3>Top Trending Blogs</h3>
              </div>
              <div className="Admindashboard-placeholder">
                <BarChart />
              </div>
            </div>

            <div className="Admindashboard-card Admindashboard-third">
              <h3>Statistics</h3>
              <div className="Admindashboard-placeholder"><BarChartlikes/></div>
            </div>
          </div>

          {/* 👇 Line Chart + Deactivated placed side by side */}
          <div className="Admindashboard-row">
            <div className="Admindashboard-card Admindashboard-third">
              <h3>Customer by Country</h3>
              <div className="Admindashboard-placeholder">
                <LineChart />
              </div>
            </div>

            <div className="Admindashboard-card Admindashboard-agent">
              <h3>Deactivated Accounts</h3>
              <div className="Admindashboard-placeholder" id='Admindashboard-placeholder-deactivated'>
                <table className='Admindashboard-table'>
                  <thead>
                    <tr>
                      <th>Profile</th>
                      <th>Email</th>
                      <th>Name</th>

                    </tr>
                  </thead>
                  <tbody>
                    {deactivated.map((item, index) => (
                      <tr key={index}>
                        <img
                          src={`${API}/${item.profileImage}`}
                          alt="profile"
                          style={{ borderRadius: "50%", backgroundSize: "contain" }}
                          height={"30rem"}
                          width={"30rem"}

                        />
                        <td>{item.email}</td>
                        <td>{item.fullname}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Admindashboard
