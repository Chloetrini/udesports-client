import filterIcon from '@/assets/filterIcon.png'
import searchIcon from '@/assets/Search.png'


export type AgeGroup = "All" | 17 | 21 | 23
export type Status = "All" | "Free" | "Transferred" | "Negotiation"


type FilterProps = {
  ageFilter: AgeGroup
  setAgeFilter: (value: AgeGroup) => void
  statusFilter: Status
  setStatusFilter: (value: Status) => void
  searchInput: string
  setSearchInput: (value: string) => void
}

const FilterPlayers = ({
  ageFilter,
  setAgeFilter,
  statusFilter,
  setStatusFilter,
  searchInput,
  setSearchInput
}: FilterProps) => {
  const ageOptions: AgeGroup[] = ["All", 17, 21, 23]
  const statusOptions: Status[] = ["All", "Free", "Transferred", "Negotiation"]

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setSearchInput((prev) => ({ ...prev, [name]: value }));
  // }

  return (
    <div className='flex flex-col md:flex-row-reverse flexRowAdjust lg:flex-row px-5 md:px-10 mb-5 py-5 shadow-[#0000001A] dark:shadow-black/40 shadow-md gap-5 md:gap-10 md:items-end md:justify-end lg:justify-start'>

      {/* SEARCH BAR */}
      <div className='border-b border-[#8E8E8E] dark:border-white/20 pb-3 md:w-[300px] h-fit lg:w-[400px]'>
        <div className='flex text-sm gap-3 lg:w-[400px] text-[#8E8E8E] font-medium font-manrope'>
          <img src={searchIcon} alt="" className='w-[17.5px] h-[17.5px]' />

          <input type="text"
            placeholder='Search: Name, Club...Age, Position'
            className='w-full h-full outline-0 bg-transparent text-[#060A0F] dark:text-white placeholder-[#8E8E8E] dark:placeholder-gray-500'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} />

        </div>
      </div>

      <div className='flex flex-col flexColAdjust lg:flex-row gap-[16px] md:gap-8 lg:gap-14'>

        {/* AGE FILTER */}
        <div className='flex flex-col md:flex-row gap-[16px] lg:gap-9'>
          <div className='flex items-center gap-4'>
            <img src={filterIcon} alt="" className='w-[20px] h-[18px] md:w-[17px] md:h-[15px] lg:w-[20px] lg:h-[18px]' />
            <p className='text-[18px] md:text-[15px] lg:text-[18px] text-[#8E8E8E] dark:text-gray-400 font-manrope'>Filter by:</p>
          </div>

          <div className='flex gap-[16px] flex-wrap'>
            {ageOptions.map((option) => (
              <button
                key={option}
                onClick={() => setAgeFilter(option)}
                className={`border rounded-[8px] font-medium text-[12px] md:text-[9px] lg:text-[12px] h-[32px] md:h-[29px] lg:h-[32px] px-4 md:px-[13px] lg:px-4 hover:bg-[#00D46A4D]
                  ${ageFilter === option
                    ? "bg-[#00D46A4D] text-[#00A553] border-0"
                    : "border-[#CAC4D0] dark:border-white/20 text-[#49454F] dark:text-gray-300"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* STATUS FILTER */}
        <div className='flex flex-col md:flex-row gap-[16px]'>
          <div>
            <p className='text-[18px] md:text-[15px] lg:text-[18px] text-[#8E8E8E] dark:text-gray-400 font-manrope'>Status</p>
          </div>

          <div className='flex gap-[16px] flex-wrap'>
            {statusOptions.map((option) => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`border rounded-[8px] font-medium text-[12px] md:text-[9px] lg:text-[12px] h-[32px] md:h-[29px] lg:h-[32px] px-4 md:px-[13px] lg:px-4 hover:bg-[#00D46A4D]
                  ${statusFilter === option
                    ? "bg-[#00D46A4D] text-[#00A553] border-0"
                    : "border-[#CAC4D0] dark:border-white/20 text-[#49454F] dark:text-gray-300"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default FilterPlayers

