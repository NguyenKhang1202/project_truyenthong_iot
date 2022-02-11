const convertTimeSchedule = (presets) => {
  const activePresets = presets.filter((preset) =>{
    return preset.status === 'on'
  })

  const timeScheduleRes = activePresets.map((preset) => {
    const {date} = preset
    const hm = date.split(':')
    return hm.map( i => parseInt(i) )
  })

  const weightRes = activePresets.map((preset) => {
    return preset.weight
  })

  return {
    timeSchedule: timeScheduleRes,
    weight: weightRes
  }
}

module.exports = convertTimeSchedule