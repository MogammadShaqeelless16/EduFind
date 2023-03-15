import { useList } from '@pankod/refine-core';
import { Box, Typography } from '@pankod/refine-mui';

import { AgentCard } from "components";

const Applications= () => {
    const { data, isLoading, isError } = useList({ resource: "users" });

    const allAgents = data?.data ?? [];

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    return (
        <Box>
            <Typography fontSize={25} fontWeight={700} color="#11142d">
                Application List
            </Typography>

            <Box
                mt="20px"
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    backgroundColor: "#fcfcfc",
                }}
            >
                {allAgents.map((agent) => (
                    <AgentCard
                        key={agent._id}
                        id={agent._id}
                        name={agent.name}
                        email={agent.email}
                        avatar={agent.avatar}
                        noOfProperties={agent.allDaycare.length}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Applications;