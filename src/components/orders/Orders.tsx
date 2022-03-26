import * as React from "react";
import { Grid, Box, Flex, Heading, Icon } from "@chakra-ui/react";
import { FaShippingFast } from "react-icons/fa";
import OrdersTable from "../common/OrdersTable";
import AccountNav from "../common/AccountNav";
import EmptyCategory from "../common/EmptyCategory";
import ContentLoader from "../common/OrdersContentLoader";
import Error from "../common/Error";
import { getOrders } from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = React.useState<OrderTypes[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [hasError, setError] = React.useState(false);
  const [shouldTryAgain, setTryAgain] = React.useState(false);

  React.useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const { data } = await getOrders();

        if (!didCancel) setOrders(data);
      } catch (ex) {
        if (!didCancel) setError(true);
      }

      if (!didCancel) {
        setLoading(false);
        setTryAgain(false);
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [shouldTryAgain]);

  const handleTryAgain = () => setTryAgain(true);

  return (
    <Box as="section" px={{ base: "4", md: "6" }} marginX="auto" maxW="1200px">
      <Grid templateColumns={{ lg: "230px 1fr" }} gridColumnGap="6">
        <AccountNav />

        {isLoading ? (
          <ContentLoader />
        ) : (
          <>
            {hasError ? (
              <Error
                onTryAgain={handleTryAgain}
                text="An error occurred due to failing network. Check your internet connection and try again."
              />
            ) : (
              <Box overflow="auto">
                <Flex align="center">
                  <Icon
                    as={FaShippingFast}
                    color="primary"
                    boxSize={{ base: "20px", sm: "24px" }}
                  />
                  <Heading
                    as="h1"
                    ml={{ base: "1", sm: "2" }}
                    fontSize={{ base: "18px", sm: "24px" }}
                  >
                    Orders
                  </Heading>
                </Flex>

                {orders.length === 0 ? (
                  <Box mt="6">
                    <EmptyCategory category="orders" />
                  </Box>
                ) : (
                  <Box overflow="auto">
                    <Box overflow="auto">
                      <OrdersTable orders={orders} />
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Orders;
