import React, { useContext, useEffect, useState } from 'react'
import Card from './ui/Card'
import { Plus } from 'lucide-react'
import TaskRow from './TaskRow'
import AppContainer from './AppContainer'
import { AppContext } from '../context/AppContext'
import { AuthContext } from '../context/AuthContext'

function NewDashboard() {

  const { loggedInUser } = useContext(AuthContext);
  const { appData, setLoading } = useContext(AppContext);

  const [stats, setStats] = useState([
    { id: 1, icon: "✅", val: ``, label: "Today" },
    { id: 2, icon: "📊", val: `${0}%`, label: "Completion" },
    { id: 3, icon: "🔥", val: `${0}d`, label: "Streak" },
  ])
  const [data, setData] = useState(
    {
      dueToday: [],
      pending: [],
      doneToday: [{
        "id": 11,
        "userId": 18,
        "name": "Morning Yoga",
        "description": "30 minutes of stretching and breathing exercises",
        "category": "health",
        "frequency": "daily",
        "customDays": [],
        "startDate": "2026-04-10T18:30:00.000Z",
        "reminder": "06:30:00",
        "createdAt": "2026-04-11T11:18:13.000Z"
      },
      {
        "id": 12,
        "userId": 18,
        "name": "Gym Workout",
        "description": "Strength training at the gym",
        "category": "fitness",
        "frequency": "weekdays",
        "customDays": [],
        "startDate": "2026-04-10T18:30:00.000Z",
        "reminder": "18:00:00",
        "createdAt": "2026-04-11T11:18:13.000Z"
      },],
      rate: 20
    })

  const onAddHabit = () => {

  }

  useEffect(() => {
    // console.log(appData);
    console.log(stats);
  }, [stats])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [])

  return (
    <div>
      {/* Greeting */}
      <p className="text-[#656d76] dark:text-[#505e6d] text-sm mb-1">{data.dateLabel}</p>
      <h1 className="text-[#1c2128] dark:text-[#e6edf3] text-[28px] font-extrabold mb-6 tracking-tight">
        {/* {data.greet}, {user.name.split(" ")[0]} 👋 */}

        Good Morning, Krunal Jumde👋
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4.5">
        {stats.map((s) => (
          <Card
            key={s.id}
            data={s}
          />
        ))}
      </div>

      {/* Progress bar */}

      <div className="px-4.5! py-3.5! mb-5 text-center bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-2xl p-5">
        <div className="flex justify-between mb-2">
          <span className="text-[#656d76] dark:text-[#8b949e] text-[13px] font-semibold">
            Daily Progress
          </span>
          <span className={`text-[13px] font-extrabold ${data.rate === 100 ? "text-green-500" : "text-[#1c2128] dark:text-[#e6edf3]"}`}>
            {data.doneToday.length} of {data.dueToday.length} done
          </span>
        </div>
        <div className="bg-[#f6f8fa] dark:bg-[#21262d] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-600 ease-in-out ${data.rate === 100 ? "gradient-success" : "gradient-progress"}`}
            style={{ width: `${data.rate}%` }}
          />
        </div>
        {data.rate === 100 && data.dueToday.length > 0 && (
          <p className="text-green-500 text-xs font-bold mt-2 text-center">
            🎉 Perfect day! All habits complete — streak continues!
          </p>
        )}
      </div>
      {/* </Card>  */}



      {/* Task list header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[#1c2128] dark:text-[#e6edf3] text-base font-extrabold m-0">
          Today's Tasks
        </h2>
        <button
          onClick={onAddHabit}
          className="flex items-center gap-1.5 px-3 py-1.75 gradient-brand border-none rounded-lg text-white text-xs font-bold cursor-pointer font-sans"
        >
          <Plus size={13} /> Add
        </button>
      </div>


      {/* {data.dueToday.length === 0 ? ( */}
      <div className="bg-white dark:bg-[#161b22] border-2 border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-2xl py-12 px-6 text-center">
        <div className="text-5xl mb-3">🌱</div>
        <p className="text-[#656d76] dark:text-[#8b949e] m-0 text-[15px]">
          No habits today — create your first one!</p>
      </div>

      {/* ) : ( */}

      <div className='my-10'></div>

      <div className="px-4.5! py-3.5! mb-5  bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-2xl p-5">
        {/* Pending section */}

        <>
          <div className="px-3.5 pt-2 pb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#656d76] dark:bg-[#8b949e]" />
            <span className="text-[#656d76] dark:text-[#8b949e] text-[11px] font-bold uppercase tracking-[0.07em]">
              Pending — {data.pending.length}
            </span>
          </div>
          {data.pending.map((h) => (
            <TaskRow
              key={h.id}
              habit={h}
            />
          ))}
        </>

        {/* Divider */}
        {/* {data.pending.length > 0 && data.doneToday.length > 0 && ( */}
        <div className="h-px bg-[#d0d7de] dark:bg-[#30363d] mx-3.5 mt-1" />
        {/* )} */}

        {/* Completed section */}
        <>
          <div className="px-3.5 pt-2 pb-1 flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-green-500 text-[11px] font-bold uppercase tracking-[0.07em]">
              Completed — {data.doneToday.length}
            </span>
          </div>
          {data.doneToday.map((h) => (
            <TaskRow key={h.id} habit={h} done={true} onToggle={() => onToggle(h.id, today)} />
          ))}
        </>
      </div>
    </div>
  )
}

export default NewDashboard