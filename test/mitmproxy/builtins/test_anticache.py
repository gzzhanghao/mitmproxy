from .. import tutils, mastertest
from mitmproxy.builtins import anticache
from mitmproxy.flow import master
from mitmproxy.flow import state
from mitmproxy import options


class TestAntiCache(mastertest.MasterTest):
    def test_simple(self):
        s = state.State()
        m = master.FlowMaster(options.Options(anticache = True), None, s)
        sa = anticache.AntiCache()
        m.addons.add(sa)

        f = tutils.tflow(resp=True)
        self.invoke(m, "request", f)

        f = tutils.tflow(resp=True)
        f.request.headers["if-modified-since"] = "test"
        f.request.headers["if-none-match"] = "test"
        self.invoke(m, "request", f)
        assert "if-modified-since" not in f.request.headers
        assert "if-none-match" not in f.request.headers
