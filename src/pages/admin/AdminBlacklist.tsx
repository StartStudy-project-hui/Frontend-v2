import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'

import {
  useGetBlacklist,
  useGetBlacklistHistory,
  useGetBlacklistHistoryByTarget,
  useRegisterBlacklist,
  useUpdateBlacklist,
  useDeleteBlacklist,
  useMakeBlacklistPermanent,
} from '@/lib/react-query/queries'
import { toast } from '@/hooks/use-toast'
import {
  BlacklistStatusList,
  BlacklistActionList,
  BlacklistDurationOptions,
} from '@/constants'
import { BlacklistItemDto } from '@/types/Dto'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const statusLabel = (value: string) =>
  BlacklistStatusList.find((item) => item.value === value)?.title || value

const actionLabel = (value: string) =>
  BlacklistActionList.find((item) => item.value === value)?.title || value

const formatDateTime = (value: string) => value.replace('T', ' ').slice(0, 19)

export default function AdminBlacklist() {
  const [listStatus, setListStatus] = useState('')
  const [listPage, setListPage] = useState(0)
  const [emailSearchInput, setEmailSearchInput] = useState('')
  const [listEmail, setListEmail] = useState('')

  const [historyStatus, setHistoryStatus] = useState('')
  const [historyAction, setHistoryAction] = useState('')
  const [historyPage, setHistoryPage] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BlacklistItemDto | null>(null)
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [durationMonths, setDurationMonths] = useState(
    BlacklistDurationOptions[0].value
  )

  const [historyTargetId, setHistoryTargetId] = useState<number | null>(null)
  const [historyTargetPage, setHistoryTargetPage] = useState(0)

  const { data: blacklistResponse, refetch: fetchBlacklist } = useGetBlacklist({
    status: listStatus || undefined,
    email: listEmail || undefined,
    page: listPage.toString(),
  })

  const { data: historyResponse, refetch: fetchHistory } = useGetBlacklistHistory({
    status: historyStatus || undefined,
    action: historyAction || undefined,
    page: historyPage.toString(),
  })

  const { data: targetHistoryResponse } = useGetBlacklistHistoryByTarget(
    {
      blacklistId: historyTargetId?.toString() ?? '',
      page: historyTargetPage.toString(),
    },
    historyTargetId !== null
  )

  const registerMutation = useRegisterBlacklist()
  const updateMutation = useUpdateBlacklist()
  const deleteMutation = useDeleteBlacklist()
  const makePermanentMutation = useMakeBlacklistPermanent()

  const openHistoryModal = (id: number) => {
    setHistoryTargetPage(0)
    setHistoryTargetId(id)
  }

  useEffect(() => {
    fetchBlacklist()
  }, [fetchBlacklist, listStatus, listEmail, listPage])

  const handleEmailSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setListPage(0)
    setListEmail(emailSearchInput.trim())
  }

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory, historyStatus, historyAction, historyPage])

  const openRegisterDialog = () => {
    setEditTarget(null)
    setEmail('')
    setReason('')
    setDurationMonths(BlacklistDurationOptions[0].value)
    setDialogOpen(true)
  }

  const openEditDialog = (item: BlacklistItemDto) => {
    setEditTarget(item)
    setReason(item.reason)
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (editTarget) {
      updateMutation.mutate(
        { blacklistId: editTarget.id.toString(), reason },
        {
          onSuccess: () => {
            toast({ title: '사유가 수정되었습니다' })
            setDialogOpen(false)
            fetchBlacklist()
          },
          onError: () => {
            toast({ title: '수정에 실패했습니다' })
          },
        }
      )
      return
    }

    registerMutation.mutate(
      { rawValue: email, reason, durationMonths },
      {
        onSuccess: () => {
          toast({ title: '블랙리스트에 등록되었습니다' })
          setDialogOpen(false)
          fetchBlacklist()
        },
        onError: () => {
          toast({ title: '등록에 실패했습니다' })
        },
      }
    )
  }

  const handleDelete = (id: number) => {
    if (!confirm('이 사용자를 블랙리스트에서 해제하시겠습니까?')) return

    deleteMutation.mutate(id.toString(), {
      onSuccess: () => {
        toast({ title: '블랙리스트에서 해제되었습니다' })
        fetchBlacklist()
      },
      onError: () => {
        toast({ title: '해제에 실패했습니다' })
      },
    })
  }

  const handleMakePermanent = (id: number) => {
    if (!confirm('이 사용자를 영구정지로 전환하시겠습니까?')) return

    makePermanentMutation.mutate(id.toString(), {
      onSuccess: () => {
        toast({ title: '영구정지로 전환되었습니다' })
        fetchBlacklist()
      },
      onError: () => {
        toast({ title: '영구정지 전환에 실패했습니다' })
      },
    })
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold text-gray-900'>블랙리스트 관리</h2>
        <Button
          className='gap-1.5 rounded-lg px-4 font-semibold'
          onClick={openRegisterDialog}
        >
          <Plus className='h-4 w-4' />
          차단 추가
        </Button>
      </div>

      <Tabs defaultValue='list' className='mt-6'>
        <TabsList>
          <TabsTrigger value='list'>블랙리스트</TabsTrigger>
          <TabsTrigger value='history'>히스토리</TabsTrigger>
        </TabsList>

        <TabsContent value='list'>
          <div className='mt-4 flex gap-2'>
            {BlacklistStatusList.map((item) => (
              <button
                key={item.id}
                type='button'
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors
                  ${
                    listStatus === item.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                onClick={() => {
                  setListStatus(item.value)
                  setListPage(0)
                }}
              >
                {item.title}
              </button>
            ))}
          </div>

          <form
            className='mt-4 flex max-w-sm gap-2'
            onSubmit={handleEmailSearch}
          >
            <Input
              type='email'
              value={emailSearchInput}
              onChange={(e) => setEmailSearchInput(e.target.value)}
              placeholder='이메일로 검색'
            />
            <Button
              type='submit'
              variant='outline'
              className='shrink-0 gap-1.5 px-3'
            >
              <Search className='h-4 w-4' />
              검색
            </Button>
            {listEmail && (
              <Button
                type='button'
                variant='ghost'
                className='shrink-0'
                onClick={() => {
                  setEmailSearchInput('')
                  setListEmail('')
                  setListPage(0)
                }}
              >
                초기화
              </Button>
            )}
          </form>

          <div className='relative mt-4 overflow-hidden overflow-x-auto rounded-xl border border-gray-100'>
            <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
              <thead className='bg-gray-50 text-xs font-semibold text-gray-500'>
                <tr>
                  <th scope='col' className='px-6 py-3'>ID</th>
                  <th scope='col' className='px-6 py-3'>유형</th>
                  <th scope='col' className='min-w-[10rem] px-6 py-3'>사유</th>
                  <th scope='col' className='px-6 py-3'>등록일</th>
                  <th scope='col' className='px-6 py-3'>상태</th>
                  <th scope='col' className='px-6 py-3'>상세</th>
                  <th scope='col' className='px-6 py-3'>관리</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {blacklistResponse?.content.map((item) => (
                  <tr className='bg-white transition-colors hover:bg-gray-50' key={item.id}>
                    <th scope='row' className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'>
                      {item.id}
                    </th>
                    <td className='whitespace-nowrap px-6 py-4'>{item.type}</td>
                    <td className='min-w-[10rem] px-6 py-4'>{item.reason}</td>
                    <td className='whitespace-nowrap px-6 py-4'>{formatDateTime(item.createdAt)}</td>
                    <td className='whitespace-nowrap px-6 py-4'>{statusLabel(item.status)}</td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <button
                        type='button'
                        className='font-medium text-gray-600 hover:underline'
                        onClick={() => openHistoryModal(item.id)}
                      >
                        히스토리 보기
                      </button>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-nowrap items-center gap-3 whitespace-nowrap'>
                        <button
                          type='button'
                          className='font-medium text-blue-600 hover:underline'
                          onClick={() => openEditDialog(item)}
                        >
                          사유 수정
                        </button>
                        {item.status !== 'PERMANENT' && (
                          <button
                            type='button'
                            className='font-medium text-orange-600 hover:underline'
                            onClick={() => handleMakePermanent(item.id)}
                          >
                            영구정지
                          </button>
                        )}
                        <button
                          type='button'
                          className='font-medium text-red-600 hover:underline'
                          onClick={() => handleDelete(item.id)}
                        >
                          해제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blacklistResponse?.content.length === 0 && (
                  <tr>
                    <td colSpan={7} className='px-6 py-8 text-center text-gray-400'>
                      등록된 블랙리스트가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {blacklistResponse && blacklistResponse.totalPages > 1 && (
            <div className='mt-6 flex items-center justify-center gap-3 text-sm'>
              <button
                type='button'
                className='disabled:pointer-events-none disabled:opacity-40'
                disabled={listPage === 0}
                onClick={() => setListPage((p) => p - 1)}
              >
                이전
              </button>
              <span className='font-medium text-gray-700'>
                {listPage + 1} / {blacklistResponse.totalPages}
              </span>
              <button
                type='button'
                className='disabled:pointer-events-none disabled:opacity-40'
                disabled={listPage + 1 >= blacklistResponse.totalPages}
                onClick={() => setListPage((p) => p + 1)}
              >
                다음
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value='history'>
          <div className='mt-4 flex flex-wrap gap-2'>
            {BlacklistStatusList.map((item) => (
              <button
                key={item.id}
                type='button'
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors
                  ${
                    historyStatus === item.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                onClick={() => {
                  setHistoryStatus(item.value)
                  setHistoryPage(0)
                }}
              >
                {item.title}
              </button>
            ))}
            <span className='mx-1 self-center text-gray-200'>|</span>
            {BlacklistActionList.map((item) => (
              <button
                key={item.id}
                type='button'
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors
                  ${
                    historyAction === item.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                onClick={() => {
                  setHistoryAction(item.value)
                  setHistoryPage(0)
                }}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className='relative mt-4 overflow-hidden overflow-x-auto rounded-xl border border-gray-100'>
            <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
              <thead className='bg-gray-50 text-xs font-semibold text-gray-500'>
                <tr>
                  <th scope='col' className='px-6 py-3'>ID</th>
                  <th scope='col' className='px-6 py-3'>액션</th>
                  <th scope='col' className='min-w-[10rem] px-6 py-3'>사유</th>
                  <th scope='col' className='px-6 py-3'>상태</th>
                  <th scope='col' className='px-6 py-3'>처리자</th>
                  <th scope='col' className='px-6 py-3'>일시</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {historyResponse?.content.map((item) => (
                  <tr className='bg-white transition-colors hover:bg-gray-50' key={item.id}>
                    <th scope='row' className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'>
                      {item.id}
                    </th>
                    <td className='whitespace-nowrap px-6 py-4'>{actionLabel(item.action)}</td>
                    <td className='min-w-[10rem] px-6 py-4'>{item.reason}</td>
                    <td className='whitespace-nowrap px-6 py-4'>{statusLabel(item.status)}</td>
                    <td className='whitespace-nowrap px-6 py-4'>{item.createBy}</td>
                    <td className='whitespace-nowrap px-6 py-4'>{formatDateTime(item.createdAt)}</td>
                  </tr>
                ))}
                {historyResponse?.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className='px-6 py-8 text-center text-gray-400'>
                      히스토리가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {historyResponse && historyResponse.totalPages > 1 && (
            <div className='mt-6 flex items-center justify-center gap-3 text-sm'>
              <button
                type='button'
                className='disabled:pointer-events-none disabled:opacity-40'
                disabled={historyPage === 0}
                onClick={() => setHistoryPage((p) => p - 1)}
              >
                이전
              </button>
              <span className='font-medium text-gray-700'>
                {historyPage + 1} / {historyResponse.totalPages}
              </span>
              <button
                type='button'
                className='disabled:pointer-events-none disabled:opacity-40'
                disabled={historyPage + 1 >= historyResponse.totalPages}
                onClick={() => setHistoryPage((p) => p + 1)}
              >
                다음
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className='flex items-center justify-between gap-4 pr-6'>
              <DialogTitle>
                {editTarget ? '차단 사유 수정' : '블랙리스트 등록'}
              </DialogTitle>
              {editTarget && (
                <Button
                  type='button'
                  variant='outline'
                  className='h-8 px-3 text-xs font-medium'
                  onClick={() => openHistoryModal(editTarget.id)}
                >
                  히스토리 보기
                </Button>
              )}
            </div>
          </DialogHeader>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            {!editTarget && (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='blacklist-email'>이메일</Label>
                <Input
                  id='blacklist-email'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='차단할 사용자의 이메일'
                />
              </div>
            )}
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='blacklist-reason'>사유</Label>
              <Input
                id='blacklist-reason'
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder='차단 사유를 입력하세요'
              />
            </div>
            {!editTarget && (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='blacklist-duration'>기간</Label>
                <select
                  id='blacklist-duration'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                >
                  {BlacklistDurationOptions.map((item) => (
                    <option key={item.id} value={item.value}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <DialogFooter>
              <Button type='submit' className='font-semibold'>
                {editTarget ? '수정' : '등록'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={historyTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setHistoryTargetId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>블랙리스트 히스토리 (ID {historyTargetId})</DialogTitle>
          </DialogHeader>

          <div className='max-h-[60vh] overflow-y-auto'>
            {targetHistoryResponse?.content.length === 0 && (
              <p className='py-8 text-center text-sm text-gray-400'>
                히스토리가 없습니다
              </p>
            )}
            <ol className='relative ml-2 border-l border-gray-200'>
              {targetHistoryResponse?.content.map((item) => (
                <li key={item.id} className='mb-6 ml-4 last:mb-0'>
                  <span className='absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-blue-600' />
                  <time className='text-xs font-medium text-gray-400'>
                    {formatDateTime(item.createdAt)}
                  </time>
                  <p className='mt-0.5 text-sm font-semibold text-gray-900'>
                    {actionLabel(item.action)}
                  </p>
                  <p className='mt-0.5 text-xs text-gray-500'>
                    처리자: {item.createBy || '-'}
                  </p>
                  <p className='mt-1 text-sm text-gray-600'>{item.reason}</p>
                </li>
              ))}
            </ol>
          </div>

          {targetHistoryResponse && targetHistoryResponse.totalPages > 1 && (
            <div className='mt-2 flex items-center justify-center gap-3 text-sm'>
              <button
                type='button'
                className='disabled:pointer-events-none disabled:opacity-40'
                disabled={historyTargetPage === 0}
                onClick={() => setHistoryTargetPage((p) => p - 1)}
              >
                이전
              </button>
              <span className='font-medium text-gray-700'>
                {historyTargetPage + 1} / {targetHistoryResponse.totalPages}
              </span>
              <button
                type='button'
                className='disabled:pointer-events-none disabled:opacity-40'
                disabled={historyTargetPage + 1 >= targetHistoryResponse.totalPages}
                onClick={() => setHistoryTargetPage((p) => p + 1)}
              >
                다음
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
