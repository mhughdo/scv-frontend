import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { Box } from '@chakra-ui/react'
import superagent from 'superagent'
import { File as IFile } from 'types'
import Playground from 'components/Playground'

import superagentPrefix from 'superagent-prefix'

const prefix = superagentPrefix(process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '')

const SharedFile: NextPage<{ file: IFile }> = function ({ file }) {
  return (
    <Box>
      <Playground file={file} />
    </Box>
  )
}

export default SharedFile

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  try {
    const { body } = await superagent.get(`/v1/file/${params?.hash}`).use(prefix)
    if (!body) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        file: body,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
