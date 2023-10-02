import React from 'react'
import {
  onValue,
  push,
  ref,
  set,
  update
} from 'firebase/database'

import { database } from './db'

export function useFirebaseRecords<T>(endpoint: FbEndpoint) {
  const [records, setRecords] = React.useState<T[]>([])

  React.useEffect(() => {
    const recordRef = ref(database, endpoint)
    onValue(recordRef, (snapshot) => {
      const fbData: Record<RecordId, Omit<T, 'id'>> = snapshot.val()
      if (!fbData) {
        setRecords([])
        return
      }
      const recordsData = Object.entries(fbData)
        .reduce((acc, [id, recordDetails]) => {
          if (!id || !recordDetails) {
            return acc
          }
          const record = { id, ...recordDetails } as T
          return acc.concat(record)
        }, [] as T[])
      setRecords(recordsData)
    })
  }, [endpoint])
  return records
}

export function useMutateFirebaseRecord<T>(endpoint: FbEndpoint) {
  return React.useCallback((record: T | null, id?: RecordId) => {
    if (!id) {
      const createRef = ref(database, endpoint)
      const newRecordRef = push(createRef)
      set(newRecordRef, record)
      return
    }
    const updateRef = ref(database)
    const updates = {
      [`${endpoint}/${id}`]: record
    }
    update(updateRef, updates)
  }, [endpoint])
}

export function useDeleteFirebaseCollection(endpoint: FbEndpoint) {
  return React.useCallback(() => {
    const updateRef = ref(database)
    const updates = {
      [`${endpoint}`]: null
    }
    update(updateRef, updates)
  }, [endpoint])
}
