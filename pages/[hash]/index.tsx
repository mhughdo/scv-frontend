import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { Box } from '@chakra-ui/react'
import superagent from 'superagent'
import { File as IFile } from 'types'
import Playground from 'components/Playground'

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
    const { body } = await superagent.get(`http://localhost:4000/v1/file/${params?.hash}`)
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
